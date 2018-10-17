/** @flow
 * @description All DNSCHK UI event hooks go here, including for popup/options
 */

import {
    icons,
    getIcon
// flow-disable-line
} from 'dnschk-utils/ui'

// TODO: need to move this type of documentation into the wiki

// ? `oracle` emits the events that you should be hooking into. Feel free to add
// ? more events as they become necessary.
// ?
// ? Currently, events include:
// ?    * origin.resolving      origin domain resolution logic should run now   (tab:chrome, instance:OriginDomain) => {}
// ?    * origin.resolved       origin domain has been resolved successfully    (tab:chrome, originDomain:string) => {}
// ?    * download.incoming     a new download has been observed                (tab:chrome, instance:OriginDomain) => {}
// ?    * download.completed    a download has completed                        (downloadItem:chrome) => {}
// ?    * judgement.safe        a resource's content is as expected             (tab:chrome, instance:OriginDomain) => {}
// ?    * judgement.unsafe      a resource's content is mutated/corrupted       (tab:chrome, instance:OriginDomain) => {}
// ?    * judgement.unknown     a resource's content cannot be judged           (tab:chrome, instance:OriginDomain) => {}
// ?    * error                 a new error event has occurred                  (error:Error) => {}
// ?
// ? See ./index.js and other events for examples of what parameters are
// ? available for handlers of the different events.

// ? Extension event flows:
// ?    1. Tab/omnibar navigation (completes):      => origin.resolving     => origin.resolved
// ?    2. User triggered download:                 => download.crossOrigin => download.incoming --> judgement.*
// ?    3. Triggered (unhandled) download finishes: => download.completed   => judgement.*
// ?    4. Some error occurs:                       => error
// ?    5. A judgement is rendered:                 => judgement.safe|unsafe|unknown

// ? Note: at any point during flows #2/3, the flow can be cancelled (i.e.
// ? remaining event handlers not processed) after which one of the
// ? `judgement.*` events will be triggered.

// ? All events triggered in flows #2/3 receive an EventFrame instance that
// ? allows access to DNSCHK's internals. See `src/utils/EventFrame` classes.

// ? The `download.incoming` and `download.crossOrigin` events receive a
// ? modified downloadItem object with the following extra props:
// ?    * downloadItem.urlDomain     the domain portion of downloadItem.url
// ?    * downloadItem.originDomain  the origin domain of the browser tab from which this downloadItem originates

// ? Note that a `downloadItem` parameter is not guaranteed to have any
// ? properties of the DownloadItem extension API with some exceptions. Do an
// ? existence check before trying to use them.

export default (oracle: any, chrome: any, context: any) => {
    // ? This is our generic error handler that fires whenever an error occurs
    oracle.addListener('error', err => {
        // TODO: indicate error condition in the UI
        console.error(`DNSCHK ERROR: ${err}`);
    });

    // ? This event fires whenever originDomain != downloadItem.urlDomain
    oracle.addListener('download.crossOrigin', (dnschk, downloadItem) => {
        // TODO: downloadItem should get a downloadItem.originDomain
        // TODO: must judge unsafe any downloadItem that triggers this event iff
        // TODO: SRS is enabled
        // dnschk.judgeUnsafe();
        dnschk.continue();
    });

    // ? This event fires whenever originDomain != downloadItem.urlDomain
    oracle.addListener('download.crossOrigin', (dnschk, downloadItem) => {
        // TODO: must ask user to approve downloadItem.urlDomain via the UI
        dnschk.continue();
    });

    // ? This event fires whenever dnschk decides it cannot judge a download
    oracle.addListener('judgement.unknown', downloadItem => {
        console.log(`file "${downloadItem.filename}" judgement: UNKNOWN`);
    });

    // ? This event fires whenever dnschk decides a download is safe
    oracle.addListener('judgement.safe', downloadItem => {
        console.log(`file "${downloadItem.filename}" judgement: SAFE`);
    });

    // ? This event fires whenever dnschk decides a download is NOT safe
    oracle.addListener('judgement.unsafe', downloadItem => {
        console.log(`file "${downloadItem.filename}" judgement: UNSAFE`);
    });
};
