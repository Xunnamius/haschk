/** @flow
 * @description All HASCHK UI event hooks go here, including for popup/options
 */

// TODO: need to move this type of documentation into the wiki

// ? `oracle` emits the events that you should be hooking into. Feel free to add
// ? more events as they become necessary. Note that new `download.complete`
// ? events must be added with oracle::prependListener().

// ? Currently, events include:
// ?    * core.init                 the extension is loaded by chrome (once)    () => {}
// ?    * download.incoming         a new download has been observed            async (e, downloadItem) => {}
// ?    * download.suspiciousOrigin a new download has been observed            async (e, downloadItem) => {}
// ?    * download.completed        a download has completed; must be prepended async (e, downloadItem) => {}
// ?    * judgement.safe            a resource's content is as expected         (downloadItem) => {}
// ?    * judgement.unsafe          a resource's content is mutated/corrupted   (downloadItem) => {}
// ?    * judgement.unknown         a resource's content cannot be judged       (downloadItem) => {}
// ?    * error                     a new error event has occurred              (err) => {}

// ? Extension event flows:
// ?    1. Chrome enables extension (only once):    => core.init
// ?    2. User triggered download:                 => download.incoming => download.suspiciousOrigin -?-> #5
// ?    3. Triggered (unhandled) download finishes: => download.completed => #5
// ?    4. Some error occurs:                       => error
// ?    5. A judgement is rendered:                 => judgement.safe|unsafe|unknown

// ? Note: at any point during flows #2/3, the flow can be cancelled (i.e.
// ? remaining event handlers not processed) after which one of the
// ? `judgement.*` events should be triggered. This is immediate (i.e. the rest
// ? of the event stack is skipped). All events triggered in flows #2/3 receive
// ? an EventFrame instance (e) that allows access to HASCHK's internals, i.e.
// ? via ::judgeUnsafe(), ::judgeSafe(), etc.

// ? All oracle events receive a modified downloadItem object with the following
// ? extra props:
// ?    * downloadItem.originDomain                 the DNS lookup base domain

// ? Note that a `downloadItem` object is not guaranteed to have any properties
// ? of the DownloadItem extension API except ::OriginDomain. Do an existence
// ? check before trying to use them. See the Extensions API for more details.

import { setBadge } from 'universe/ui'
import { FrameworkEventEmitter } from 'universe/events'
import { Debug } from 'universe'
import type { Chrome } from 'universe'

export default (oracle: FrameworkEventEmitter, chrome: Chrome, context: Object) => {
    // ? This is our generic error handler that fires whenever an error occurs
    oracle.addListener('error', err => {
        setBadge(chrome)('ERR', '#000');
        console.error(`HASCHK ERROR: ${err}`);
    });

    // ? This event fires whenever a new download is observed
    oracle.addListener('download.incoming', async (e, downloadItem) => {
        // TODO: add the new download to popup UI (tell popup UI to update)
        // ! Note how this function is async, which means you can await Promises
        Debug.log(`file "${downloadItem.filename}" incoming`);
    });

    // ? This event fires whenever haschk decides it cannot judge a download
    oracle.addListener('judgement.unknown', downloadItem => {
        setBadge(chrome)(' ', '#D0D6B5');
        Debug.log(`file "${downloadItem.filename}" judgement: UNKNOWN`);
    });

    // ? This event fires whenever haschk decides a download is safe
    oracle.addListener('judgement.safe', downloadItem => {
        setBadge(chrome)(' ', '#6EEB83');
        Debug.log(`file "${downloadItem.filename}" judgement: SAFE`);
    });

    // ? This event fires whenever haschk decides a download is NOT safe
    oracle.addListener('judgement.unsafe', downloadItem => {
        setBadge(chrome)(' ', '#FF3C38');
        Debug.log(`file "${downloadItem.filename}" judgement: UNSAFE`);
    });

    oracle.addListener('ui.clear', () => {
        setBadge(chrome)('');
        context.judgedDownloadItems = [];
    });

};
