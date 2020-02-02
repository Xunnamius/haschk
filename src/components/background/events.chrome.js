/** @flow
 * @description All higher-level extension event logic is here
 */

import { extendDownloadItemInstance } from 'universe'
import { portEvent } from 'universe/ui'

import {
    EventFrame,
    FrameworkEventEmitter
} from 'universe/events'

import type { Chrome } from 'components/background'

const resultHandlerFactory = (eventName, context, port) => (downloadItem) => {
    port.postMessage(portEvent(eventName, downloadItem));
};

// ? Essentially, we hook into four browser-level events here:
// ?    - when the extension is first installed
// ?    - when a tab finishes navigating to a URL
// ?    - when a download is started
// ?    - when a download finishes

export default (oracle: FrameworkEventEmitter, chrome: Chrome, context: Object) => {
    // ? These fire when judgements are made about downloads and send them out
    // ? to other components of the extension.
    // ?
    // ? Three events are made available:
    // ? * judgement.safe       a resource's content is as expected
    // ? * judgement.unsafe     a resource's content is mutated/corrupted
    // ? * judgement.unknown    a resource's content cannot be judged (ignored)

    chrome.runtime.onConnect.addListener((port) => {
        console.log('runtime.onConnect: ', port);

        const handlerUnsafeResult = resultHandlerFactory('judgement.unsafe', context, port);
        const handlerSafeResult = resultHandlerFactory('judgement.safe', context, port);
        const handlerUnknownResult = resultHandlerFactory('judgement.unknown', context, port);

        port.onDisconnect.addListener(() => {
            console.log('(port.onDisconnect)');
            oracle.removeListener('judgement.unsafe', handlerUnsafeResult);
            oracle.removeListener('judgement.safe', handlerSafeResult);
            oracle.removeListener('judgement.unknown', handlerUnknownResult);
        });

        oracle.addListener('judgement.unsafe', handlerUnsafeResult);
        oracle.addListener('judgement.safe', handlerSafeResult);
        oracle.addListener('judgement.unknown', handlerUnknownResult);

        port.onMessage.addListener(message => {
            console.log('port.onMessage: ', message);
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
        console.log('runtime.onInstalled: ', details);
        if(['install', 'update'].includes(details.reason))
            chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
    });

    // ? This event fires whenever a navigation event first begins
    chrome.webRequest.onBeforeRequest.addListener(details => {
        console.log('webRequest.onBeforeRequest: ', details);
    });

    // ? This event fires whenever a navigation event completes
    chrome.webRequest.onCompleted.addListener(details => {
        console.log('webRequest.onCompleted: ', details);
    });

    // ? This event fires whenever an error occurs during a web request
    chrome.webRequest.onErrorOccurred.addListener(details => {
        console.log('webRequest.onErrorOccurred: ', details);
    });

    // ? This event fires when a new download begins in chrome
    chrome.downloads.onCreated.addListener(downloadItem => {
        console.log('downloads.onCreated: ', downloadItem);
        const eventFrame = new EventFrame();
        extendDownloadItemInstance(downloadItem);

        oracle.emit('download.incoming', eventFrame, downloadItem).then(() => {
            try {
                if(eventFrame.stopped)
                    context.handledDownloadItems.add(downloadItem.id);

                eventFrame.finish();
            }

            catch(err) {
                oracle.emit('error', err);
            }
        });

        return true;
    });

    // ? This event fires when some download-related event changes
    chrome.downloads.onChanged.addListener(targetItem => {
        console.log('downloads.onChanged: ', targetItem);
        // ? Only trigger the moment a download completes and only if this event
        // ? has not already been cancelled
        if(targetItem?.state?.current == 'complete' && !context.handledDownloadItems.has(targetItem.id)) {
            // ? We need to ask for the full DownloadItem instance due to
            // ? security
            chrome.downloads.search({ id: targetItem.id }, ([ downloadItem ]) => {
                const eventFrame = new EventFrame(oracle, context);
                oracle.emit('download.completed', eventFrame, extendDownloadItemInstance(downloadItem));
            });
        }
    });
};
