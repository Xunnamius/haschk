/** @flow
 * @description All higher-level extension event hooks go here
 */

import { OriginDomain } from 'dnschk-utils'

export default (oracle, chrome) => {
    // ? This event fires whenever a tab completely finishes loading a page
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        const originDomain = new OriginDomain;

        if(changeInfo.status == 'complete')
            oracle.emit('origin.resolving', tab, originDomain);

        oracle.emit('origin.resolved', originDomain);
    });

    // ? This event fires with a DownloadItem object when a new download begins
    // ? in chrome
    chrome.downloads.onCreated.addListener(downloadItem => {
        oracle.emit('download.new', downloadItem);
    });

    // ? This event fires with a DownloadItem object when some download-related
    // ? event changes
    chrome.downloads.onChanged.addListener(targetItem => {
        // ? Only trigger the moment a download completes
        if(targetItem?.state?.current == 'complete') {
            // ? We need to ask for the full DownloadItem instance due to
            // ? security
            chrome.downloads.search({ id: targetItem.id }, ([ downloadItem ]) => {
                oracle.emit('download.completed', downloadItem);
            });
        }
    });
};
