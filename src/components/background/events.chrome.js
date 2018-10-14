/** @flow
 * @description All higher-level extension event logic is here
 */

// flow-disable-line
import OriginDomain from 'dnschk-utils/OriginDomain'
// flow-disable-line
import { DownloadNewEventFrame } from 'dnschk-utils/events'

export default (oracle: any, chrome: any, context: any) => {
    // ? This event fires whenever a tab completely finishes loading a page
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if(changeInfo.status == 'complete') {
            const originDomain = new OriginDomain;

            oracle.emit('origin.resolving', tab, originDomain);
            oracle.emit('origin.resolved', tab, originDomain.toString());
        }
    });

    // ? This event fires with a DownloadItem object when a new download begins
    // ? in chrome; also allows suggesting a filename via callback function
    chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggestFilename) => {
        const eventFrame = new DownloadNewEventFrame(suggestFilename);

        oracle.emit('download.incoming', eventFrame, downloadItem);

        if(eventFrame.stopped)
            context.handledDownloadItems.add(downloadItem.id);

        eventFrame.finish();
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
                oracle.emit('download.completed', downloadItem);
            });
        }
    });
};
