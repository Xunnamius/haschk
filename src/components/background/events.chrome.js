/** @flow
 *  @description These are the foundational functions responsible for bridging Chrome's event system with our own
 */

import http from 'axios'

import {
    Debug,
    extractBDCandidatesFromURI,
    JUDGEMENT_UNKNOWN,
    JUDGEMENT_UNDECIDED,
    GOOGLE_DNS_HTTPS_BACKEND_EXISTS,
} from 'universe'

import {
    EventFrame,
    EventFrameEmitter,
    portMessageToEvent,
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
    chrome.runtime.onConnect.addListener((port) => {
        Debug.log('runtime.onConnect: ', port);

        // ? Whenever an event is triggered, we send it out for any other
        // ? interested components in the system to pick up on
        const globalListener = oracle.addGlobalListener((eventFrame: EventFrame, args: Array<any>) => {
            port.postMessage(eventFrameToPortMessage(eventFrame, args));
        });

        // ? When a port is destroyed for whatever reason (page refresh, popup
        // ? closed, etc), remove the (dead) global listener associated with it
        port.onDisconnect.addListener(() => {
            Debug.log('(port disconnected)');
            oracle.removeGlobalListener(globalListener);
        });

        // ? This fires when we receive a message from another component of the
        // ? extension. We translate the message into an event and emit it
        port.onMessage.addListener(data => {
            Debug.log('port.onMessage: ', data);
            const { eventFrame, args } = portMessageToEvent(data);
            oracle.emitIgnoreGlobalListeners(eventFrame.name, eventFrame, ...args);
        });
    });

    // ? This event fires when the extension is first installed
    chrome.runtime.onInstalled.addListener(details => {
        Debug.log('runtime.onInstalled: ', details);

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

        Debug.log(`webRequest.onBeforeRequest: ${details.requestId} =>`, context.navHistory.get(details.requestId));
    }, webRequestFilter);

    // ? This event fires whenever a WebRequest error occurs
    // * Only fires if we're debugging
    Debug.if(() => chrome.webRequest.onErrorOccurred.addListener(details => {
        console.log('webRequest.onErrorOccurred: ', details);
    }, webRequestFilter));

    // ? This event fires when a new download begins in chrome
    // * Note: the DownloadItem passed at this point is incomplete!
    // ! Sometimes this event fires for old downloads far in the past (months,
    // ! even years), so we cannot trust this event without a check
    chrome.downloads.onCreated.addListener(downloadItem => {
        if(!downloadItem.endTime) {
            Debug.log('downloads.onCreated: ', downloadItem);
            oracle.emit('download.incoming', downloadItem);
        }

        else Debug.log('[IGNORED] downloads.onCreated: ', downloadItem);
    });

    // ? This event fires when some download-related event changes
    chrome.downloads.onChanged.addListener(targetItem => {
        Debug.log('downloads.onChanged: ', targetItem);

        // ? Only trigger the moment a download completes
        if(targetItem?.state?.current == 'complete') {
            /**
             * ? We ask for the most up-to-date DownloadItem instance and extend
             * ? it with the following useful information:
             * ?   - backendDomain {string|null}   The BD of this download or NULL if HASCHK was not implemented
             * ?   - requestId     {string}        The Request ID associated with this download
             * ?   - requestStack  {Array<Object>} A FILO stack of `details` objects
             * ?   - judgement     {boolean}       What HASCHK thinks about this DownloadItem (undecided or unknown)
             * ?
             * ? If backendDomain is NULL, then judgement will be JUDGEMENT_UNKNOWN, otherwise JUDGEMENT_UNDECIDED
             */
            chrome.downloads.search({ id: targetItem.id }, async ([ downloadItem ]) => {
                downloadItem.judgement = JUDGEMENT_UNKNOWN;
                downloadItem.backendDomain = null;

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
                loop:
                for (const uri of downloadItem.requestStack.slice(0).reverse()) {
                    for (const candidate of extractBDCandidatesFromURI(uri)) {
                        const query = await http.get(GOOGLE_DNS_HTTPS_BACKEND_EXISTS(candidate));
                        const data = !query.data.Answer ? '<no answer>' : query.data.Answer.slice(-1)[0].data;

                        if(data == '"OK"') {
                            downloadItem.backendDomain = candidate;
                            downloadItem.judgement = JUDGEMENT_UNDECIDED;
                            break loop;
                        }
                    }
                }

                oracle.emit('download.completed', downloadItem);
            });
        }
    });
};
