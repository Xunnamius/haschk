/** @flow
 *  @description These are the foundational functions responsible for bridging Chrome's event system with our own
 */

import http from 'axios'

import {
    Debug,
    extractBDCandidatesFromURI,
    extractAnswerDataFromResponse,
    GOOGLE_DNS_HTTPS_BACKEND_EXISTS,
    JUDGEMENT_UNKNOWN,
    JUDGEMENT_UNDECIDED,
    MAX_REQUEST_HISTORY,
} from 'universe'

import {
    EventFrame,
    EventFrameEmitter,
    portMessageToEventFrame,
    eventFrameToPortMessage,
} from 'universe/events'

import type { Chrome } from 'universe'

declare var Port;

/**
 * * See: https://developer.chrome.com/extensions/webRequest#type-RequestFilter
 */
const webRequestFilter = {
    urls: [
        'http://*/*',
        'https://*/*',
    ]
};

/**
 * ? The following function hooks HASCHK into these browser-level events:
 * ?   - When the extension is first installed
 * ?   - When an http/s web request is started
 * ?   - When an http/s web request results in an error (debug only)
 * ?   - When a download first starts
 * ?   - When a download finishes
 * ?   - When a message is received from another component of the extension
 */
export default (oracle: EventFrameEmitter, chrome: Chrome, context: Object) => {
    chrome.runtime.onConnect.addListener(port => {
        Debug.log(chrome, '[BACKGROUND EVENT] (port connected)', port);

        // ? Whenever an event is triggered, we send it out for any other
        // ? interested components in the system to pick up on
        const globalListener = oracle.addGlobalListener((eventFrame: EventFrame, args: Array<any>) => {
            Debug.log(chrome, '[BACKGROUND EVENT] (event and args sent through port)', port, eventFrame, args);
            port.postMessage(eventFrameToPortMessage(eventFrame, args));
        });

        // ? When a port is destroyed for whatever reason (page refresh, popup
        // ? closed, etc), remove the (dead) global listener associated with it
        port.onDisconnect.addListener(() => {
            Debug.log(chrome, '[BACKGROUND EVENT] (port disconnected)', port);
            oracle.removeGlobalListener(globalListener);
        });

        // ? This fires when we receive a message from another component of the
        // ? extension. We translate the message into an event and emit it
        port.onMessage.addListener(data => {
            Debug.log(chrome, '[BACKGROUND EVENT] (event and args received through port)', port, data);
            const { eventFrame, args } = portMessageToEventFrame(data);
            oracle.emitIgnoreGlobalListeners(eventFrame.name, eventFrame, ...args);
        });
    });

    // ? This event fires when the extension is first installed
    chrome.runtime.onInstalled.addListener(details => {
        Debug.log(chrome, '[BACKGROUND EVENT] runtime.onInstalled:', details);

        if(['install', 'update'].includes(details.reason))
            chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });

        oracle.emit('startup', details);
    });

    // ? This event fires whenever a navigation event first begins
    chrome.webRequest.onBeforeRequest.addListener(details => {
        if(context.navHistory.has(details.requestId))
            context.navHistory.get(details.requestId).unshift(details.url);
        else
            context.navHistory.set(details.requestId, [details.url]);

        Debug.log(
            chrome,
            `[BACKGROUND EVENT] webRequest.onBeforeRequest: ${details.requestId} =>`,
            context.navHistory.get(details.requestId)
        );

        if(context.navHistory.size > MAX_REQUEST_HISTORY) {
            // ? If the navigation history map is too large, do FIFO eviction
            const evictedRequestId = context.navHistory.keys().next().value;
            context.navHistory.delete(evictedRequestId);
            Debug.log(chrome, `[BACKGROUND EVENT] (evicted ${evictedRequestId} from navigation history)`);
        }
    }, webRequestFilter);

    // ? This event fires whenever a WebRequest error occurs
    // * Only fires if we're debugging
    Debug.if(() => chrome.webRequest.onErrorOccurred.addListener(details => {
        console.log('[BACKGROUND EVENT] webRequest.onErrorOccurred:', details);
    }, webRequestFilter));

    // ? This event fires when a new download begins in chrome
    // * Note: the DownloadItem passed at this point is incomplete!
    // ! Sometimes this event fires for old downloads far in the past (months,
    // ! even years), so we cannot trust this event without a check
    chrome.downloads.onCreated.addListener(downloadItem => {
        if(!downloadItem.endTime) {
            Debug.log(chrome, '[BACKGROUND EVENT] downloads.onCreated:', downloadItem);
            oracle.emit('download.incoming', downloadItem);
        }

        else Debug.log(chrome, '[IGNORED BACKGROUND EVENT] downloads.onCreated:', downloadItem);
    });

    // ? This event fires when some download-related event changes
    chrome.downloads.onChanged.addListener(targetItem => {
        Debug.log(chrome, '[BACKGROUND EVENT] downloads.onChanged:', targetItem);

        // ? We ask for the most up-to-date DownloadItem instance
        chrome.downloads.search({ id: targetItem.id }, async ([ downloadItem ]) => {
            if(chrome.runtime.lastError) {
                oracle.emit('error', chrome.runtime.lastError.message);
                return;
            }

            downloadItem.judgement = JUDGEMENT_UNKNOWN;
            downloadItem.backendDomain = null;

            // ! If downloadItem.judgement === JUDGEMENT_UNKNOWN, none of the
            // ! extended properties (below) if any are guaranteed to exist!

            // ? If a download is paused, resumed, or cancelled, alert everyone
            // * Note: the DownloadItem passed at these ^ points is incomplete!

            if(targetItem?.paused?.current === true)
                oracle.emit('download.paused', downloadItem);

            else if(targetItem?.paused?.current === false)
                oracle.emit('download.resumed', downloadItem);

            else if(targetItem?.state?.current == 'interrupted')
                oracle.emit('download.interrupted', downloadItem);

            /**
             * ? Extend the downloadItem with the following useful information
             * ? upon completion (`backendDomain` and `judgement` technically
             * ? always exist on any DownloadItems distributed through the
             * ? oracle):
             * ?
             * ?   - backendDomain {string|null}   The BD of this download or NULL if HASCHK was not implemented
             * ?   - requestId     {string}        The Request ID associated with this download
             * ?   - requestStack  {Array<Object>} A FILO stack of `details` objects
             * ?   - judgement     {boolean}       What HASCHK thinks about this DownloadItem (undecided or unknown)
             * ?
             * ? If backendDomain is NULL, then judgement will always be
             * ? JUDGEMENT_UNKNOWN, otherwise it will be JUDGEMENT_UNDECIDED
             */
            else if(targetItem?.state?.current == 'complete') {
                // First, identify the request stack and ID that lead to this
                // download using DownloadItem::url and querying the top of the
                // stack

                for (const [requestId, requestStack] of context.navHistory) {
                    if(requestStack[0] == downloadItem.finalUrl) {
                        downloadItem.requestId = requestId;
                        downloadItem.requestStack = requestStack;
                        break;
                    }
                }

                // Resolve the backend domain: consider the request stack as a
                // queue and walk from the head (bottom of the stack) to the
                // tail (top of the stack) until we get a response back from a
                // 3LD or 2LD.
                if(downloadItem.requestStack) {
                    loop:
                    for (const uri of downloadItem.requestStack.slice(0).reverse()) {
                        for (const candidate of extractBDCandidatesFromURI(uri)) {
                            const response = await http.get(GOOGLE_DNS_HTTPS_BACKEND_EXISTS(candidate));
                            const data = extractAnswerDataFromResponse(response);

                            if(data === 'ok') {
                                downloadItem.backendDomain = candidate;
                                downloadItem.judgement = JUDGEMENT_UNDECIDED;
                                break loop;
                            }
                        }
                    }
                }

                oracle.emit('download.completed', downloadItem);
            }
        });
    });
};
