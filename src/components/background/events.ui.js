/** @flow
 *  @description All HASCHK UI logic goes here (i.e. popup, options)
 */

import { setBadge } from 'universe/ui'
import { EventFrameEmitter } from 'universe/events'
import { Debug } from 'universe'
import type { Chrome } from 'universe'

export default (oracle: EventFrameEmitter, chrome: Chrome, context: Object) => {
    // ? This is our generic error handler that fires whenever an error occurs
    oracle.addListener('error', (errorFrame, exception, errorArgs) => {
        Debug.log(`ErrorFrame:`, errorFrame);
        Debug.log(`Exception object:`, exception);
        Debug.log(`ErrorArgs:`, errorArgs);

        // TODO
        setBadge(chrome)('ERR', '#000');
        console.error(`HASCHK ERROR: ${exception}`);
    });

    // ? This event fires whenever a new download is observed
    oracle.addListener('download.incoming', async (e, downloadItem) => {
        // TODO: add the new download to popup UI (tell popup UI to update)
        // ! Note how this function is async, which means you can await Promises
        Debug.log(`file incoming from ${downloadItem.finalUrl}`);
    });

    // ? This event fires whenever haschk decides it cannot judge a download
    oracle.addListener('judgement.unknown', downloadItem => {
        // TODO
        setBadge(chrome)(' ', '#D0D6B5');
        Debug.log(`file "${downloadItem.filename}" judgement: UNKNOWN`);
    });

    // ? This event fires whenever haschk decides a download is safe
    oracle.addListener('judgement.safe', downloadItem => {
        // TODO
        setBadge(chrome)(' ', '#6EEB83');
        Debug.log(`file "${downloadItem.filename}" judgement: SAFE`);
    });

    // ? This event fires whenever haschk decides a download is NOT safe
    oracle.addListener('judgement.unsafe', downloadItem => {
        // TODO
        setBadge(chrome)(' ', '#FF3C38');
        Debug.log(`file "${downloadItem.filename}" judgement: UNSAFE`);
    });

    oracle.addListener('ui.clear', () => {
        // TODO
        setBadge(chrome)('');
        context.judgedDownloadItems = [];
    });
};
