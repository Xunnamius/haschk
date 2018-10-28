/** @flow
 * @description Events that manage context object and extension storage
 */

const SYNC_STORAGE = chrome.storage.sync;
const LOCAL_STORAGE = chrome.storage.sync;

export default (oracle: any, chrome: any, context: any) => {

    oracle.addListener('storage.handledDownloadItems.add', (downloadItem) => {
        context.handledDownloadItems.add(downloadItem);
        LOCAL_STORAGE.set({
            'handledDownloadItems': Object.from(context.handledDownloadItems)
        });
    });

};
