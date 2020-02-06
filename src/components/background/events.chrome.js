/** @flow
 * @description All higher-level extension event logic is here
 */

import { extendDownloadItemInstance } from 'universe'
import { portEvent } from 'universe/ui'

import {
    EventFrame,
    FrameworkEventEmitter
} from 'universe/events'

import { Debug } from 'universe'
import type { Chrome } from 'universe'

const resultHandlerFactory = (eventName, context, port) => (downloadItem) => {
    port.postMessage(portEvent(eventName, downloadItem));
};

const webRequestFilter = {
    urls: [
        'http://*/*',
        'https://*/*',
    ]
};

// ? Essentially, we hook into four browser-level events here:
// ?    - when the extension is first installed
// ?    - when an http/s web request is started
// ?    - when an http/s web request results in an error
// ?    - when a download first starts
// ?    - when a download finishes

export default (oracle: FrameworkEventEmitter, chrome: Chrome, context: Object) => {
    chrome.runtime.onConnect.addListener((port) => {
        Debug.log('runtime.onConnect: ', port);

        const handlerUnsafeResult = resultHandlerFactory('judgement.unsafe', context, port);
        const handlerSafeResult = resultHandlerFactory('judgement.safe', context, port);
        const handlerUnknownResult = resultHandlerFactory('judgement.unknown', context, port);

        port.onDisconnect.addListener(() => {
            Debug.log('(port.onDisconnect)');
            oracle.removeListener('judgement.unsafe', handlerUnsafeResult);
            oracle.removeListener('judgement.safe', handlerSafeResult);
            oracle.removeListener('judgement.unknown', handlerUnknownResult);
        });

        // ? These fire when judgements are made about downloads and send them out
        // ? to other components of the extension.
        // ?
        // ? Three events are made available:
        // ? * judgement.safe       a resource's content is as expected
        // ? * judgement.unsafe     a resource's content is mutated/corrupted
        // ? * judgement.unknown    a resource's content cannot be judged (ignored)
        oracle.addListener('judgement.unsafe', handlerUnsafeResult);
        oracle.addListener('judgement.safe', handlerSafeResult);
        oracle.addListener('judgement.unknown', handlerUnknownResult);

        // TODO: describe me too
        port.onMessage.addListener(message => {
            Debug.log('port.onMessage: ', message);
            if(message.event.charAt(0) !== '.' && message.event == 'fetch')
            {
                let values = {};
                message?.data.forEach((key) => {
                    values[key] = context[key];
                });

                port.postMessage(values);
            }

            else
            {
                oracle.emit(message.event.substring(1), ...message.data);

                // ? Remember all HaschkEventPort emits are promises waiting for
                // ? a response, but when we interact with internal events
                // ? (e.g. .judgement.unsafe) there is no response! so this
                // ? is just an empty response so the promise resolves.
                port.postMessage('✓');
            }
        });
    });

    // ? This event fires when the extension is first installed
    chrome.runtime.onInstalled.addListener(details => {
        Debug.log('runtime.onInstalled: ', details);
        if(['install', 'update'].includes(details.reason))
            chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
    });

    // ? This event fires whenever a navigation event first begins
    chrome.webRequest.onBeforeRequest.addListener(details => {
        Debug.log('webRequest.onBeforeRequest: ', details);
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
        oracle.emit('download.incoming', new EventFrame(), downloadItem);
    });

    // ? This event fires when some download-related event changes
    chrome.downloads.onChanged.addListener(targetItem => {
        Debug.log('downloads.onChanged: ', targetItem);

        // ? Only trigger the moment a download completes
        if(targetItem?.state?.current == 'complete') {
            // ? We need to ask for the most up-to-date DownloadItem object
            chrome.downloads.search({ id: targetItem.id }, ([ downloadItem ]) => {
                oracle.emit('download.completed', new EventFrame(), extendDownloadItemInstance(downloadItem));
            });
        }
    });
};
