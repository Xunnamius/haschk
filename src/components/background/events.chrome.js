/** @flow
 * @description All higher-level extension event logic is here
 */

import { extendDownloadItemInstance } from 'universe'
import { DownloadEventFrame } from 'universe/events'
import { DnschkPort } from 'universe/DnschkPort'

// ? Essentially, we hook into three browser-level events here:
// ?    - when a tab finishes navigating to a URL
// ?    - when a download is started
// ?    - when a download finishes

export default (oracle: any, chrome: any, context: any) => {
    chrome.runtime.onConnect.addListener((bridge) =>
    {
        bridge.onMessage.addListener((message) =>
        {
            if(message.event.charAt(0) !== '.') 
            {
                oracle.emit(`bridge.${message.event}`, bridge,...message.data);
            }
            else
            {
                oracle.emit(message.event.substring(1), ...message.data);bridge.postMessage('✓');
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
