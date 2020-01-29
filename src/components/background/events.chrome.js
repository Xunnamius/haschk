/** @flow
 * @description All higher-level extension event logic is here
 */

import { extendDownloadItemInstance } from 'universe'
import { portEvent } from 'universe/ui'

import {
    DownloadEventFrame,
    FrameworkEventEmitter
} from 'universe/events'

import type { Chrome } from 'components/background'

// ? Essentially, we hook into four browser-level events here:
// ?    - when the extension is first installed
// ?    - when a tab finishes navigating to a URL
// ?    - when a download is started
// ?    - when a download finishes

export default (oracle: FrameworkEventEmitter, chrome: Chrome, context: Object) => {
    // ? This event fires when the extension is first installed

    chrome.runtime.onInstalled.addListener(details => {
        if(details.reason == 'install') {
            chrome.tabs.create({ url: chrome.runtime.getURL('assets/welcome.html') });
        }
    });

    // ? There are better ways to do this, but until then these fire when
    // ? judgements are made about downloads and then notifies the open ports
    // ?
    // ? Three events are made available:
    // ? * judgement.safe       a resource's content is as expected
    // ? * judgement.unsafe     a resource's content is mutated/corrupted
    // ? * judgement.unknown    a resource's content cannot be judged
    // TODO: Write class + split up

    chrome.runtime.onConnect.addListener((port) => {
        port.onDisconnect.addListener(_port => delete context.activePorts[_port.sender.id]);

        if(!context.registeredPorts.includes(port.sender.id))
        {
            context.registeredPorts.push(port.sender.id);
            context.activePorts[port.sender.id] = port;

            oracle.addListener('judgement.unsafe', (downloadItem) => {
                if(context.activePorts[port.sender.id])
                    context.activePorts[port.sender.id].postMessage(portEvent('judgement.unsafe', downloadItem));
            });

            oracle.addListener('judgement.safe', (downloadItem) => {
                if(context.activePorts[port.sender.id])
                    context.activePorts[port.sender.id].postMessage(portEvent('judgement.safe', downloadItem));
            });

            oracle.addListener('judgement.unknown', (downloadItem) => {
                if(context.activePorts[port.sender.id])
                    context.activePorts[port.sender.id].postMessage(portEvent('judgement.unknown', downloadItem));
            });
        }

        else
            context.activePorts[port.sender.id] = port;

        port.onMessage.addListener(message => {
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

    // ? This event fires whenever a tab completely finishes loading a page
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if(changeInfo.status ==  'complete')
            context.timingData[tab.url] = Date.now();
    });

    // ? This event fires with a DownloadItem object when a new download begins
    // ? in chrome; also allows suggesting a filename via callback function
    chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggestFilename: Function) => {
        const eventFrame = new DownloadEventFrame(oracle, context, suggestFilename);
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

    // ? This event fires with a DownloadItem object when some download-related
    // ? event changes
    chrome.downloads.onChanged.addListener(targetItem => {
        // ? Only trigger the moment a download completes and only if this event
        // ? has not already been cancelled
        if(targetItem?.state?.current == 'complete' && !context.handledDownloadItems.has(targetItem.id)) {
            // ? We need to ask for the full DownloadItem instance due to
            // ? security
            chrome.downloads.search({ id: targetItem.id }, ([ downloadItem ]) => {
                const eventFrame = new DownloadEventFrame(oracle, context);
                oracle.emit('download.completed', eventFrame, extendDownloadItemInstance(downloadItem));
            });
        }
    });
};
