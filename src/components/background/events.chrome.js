/** @flow
 *  @description These are the foundational functions responsible for bridging Chrome's event system with our own
 */

import {
    Debug,
    extractOriginDomainFromURI,
    JUDGEMENT_UNDECIDED,
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
        Debug.log('webRequest.onBeforeRequest: ', details);
        // TODO
    }, webRequestFilter);

    // ? This event fires whenever a WebRequest error occurs
    // * Only fires if we're debugging
    Debug.if(() => chrome.webRequest.onErrorOccurred.addListener(details => {
        Debug.log('webRequest.onErrorOccurred : ', details);
    }, webRequestFilter));

    // ? This event fires when a new download begins in chrome
    // * Note: the DownloadItem passed at this point is incomplete!
    // ! Sometimes this event fires for old downloads far in the past (months,
    // ! even years), so we cannot trust that this event
    chrome.downloads.onCreated.addListener(downloadItem => {
        Debug.log('downloads.onCreated: ', downloadItem);
        oracle.emit('download.incoming', downloadItem);
    });

    // ? This event fires when some download-related event changes
    chrome.downloads.onChanged.addListener(targetItem => {
        Debug.log('downloads.onChanged: ', targetItem);

        // ? Only trigger the moment a download completes
        if(targetItem?.state?.current == 'complete') {
            /**
             * ? We ask for the most up-to-date DownloadItem instance and extend
             * ? it with the following useful information:
             * ?   - originDomain {String}        The OD of this download
             * ?   - requestId    {Number}        The Request ID associated with this download
             * ?   - requestStack {Array<Object>} A FILO stack of `details` objects
             * ?   - judgement    {Boolean}       What HASCHK thinks about this DownloadItem (this is added later)
             */
            chrome.downloads.search({ id: targetItem.id }, ([ downloadItem ]) => {
                // TODO
                const uri: string = downloadItem.referrer || downloadItem.url;
                context;

                if(!uri) throw new Error('cannot determine originDomain');

                downloadItem.originDomain = extractOriginDomainFromURI(uri);
                downloadItem.judgement = JUDGEMENT_UNDECIDED;

                oracle.emit('download.completed', downloadItem);
            });
        }
    });
};
