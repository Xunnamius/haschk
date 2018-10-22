/** @flow
 * @description All DNSCHK UI event hooks go here, including for popup/options
 */

// TODO: need to move this type of documentation into the wiki

// ? `oracle` emits the events that you should be hooking into. Feel free to add
// ? more events as they become necessary.
// ?
// ? Currently, events include:
// ?    * core.init                 the extension is loaded by chrome (once)    () => {}
// ?    * download.incoming         a new download has been observed            async (e, downloadItem) => {}
// ?    * download.suspiciousOrigin a new download has been observed            async (e, downloadItem) => {}
// ?    * download.completed        a download has completed                    async (e, downloadItem) => {}
// ?    * judgement.safe            a resource's content is as expected         (downloadItem) => {}
// ?    * judgement.unsafe          a resource's content is mutated/corrupted   (downloadItem) => {}
// ?    * judgement.unknown         a resource's content cannot be judged       (downloadItem) => {}
// ?    * error                     a new error event has occurred              (error) => {}
// ?
// ? See ./index.js and other events for examples of what parameters are
// ? available for handlers of the different events.

// ? Extension event flows:
// ?    1. Chrome enables extension (only once):    => core.init
// ?    2. User triggered download:                 => download.incoming => download.suspiciousOrigin -?-> #5
// ?    3. Triggered (unhandled) download finishes: => download.completed => #5
// ?    4. Some error occurs:                       => error
// ?    5. A judgement is rendered:                 => judgement.safe|unsafe|unknown

// ? Note: at any point during flows #2/3, the flow can be cancelled (i.e.
// ? remaining event handlers not processed) after which one of the
// ? `judgement.*` events should be triggered. In the case of flow #2, this is
// ? immediate (i.e. the rest of the event stack is skipped).

// ? All events triggered in flows #2/3 receive an EventFrame instance that
// ? allows access to DNSCHK's internals, i.e. via ::judgeUnsafe(), ::judgeSafe(),
// ? etc.

// ? All oracle events receive a modified downloadItem object with the following
// ? extra props:
// ?    * downloadItem.originDomain                 the DNS lookup base domain

// ? Note that a `downloadItem` parameter is not guaranteed to have any
// ? properties of the DownloadItem extension API except ::OriginDomain. Do an
// ? existence check before trying to use them.

export default (oracle: any, chrome: any, context: any) => {
    void chrome, context;

    // ? This is our generic error handler that fires whenever an error occurs
    oracle.addListener('error', err => {
        // TODO: indicate error condition in the UI
        console.error(`DNSCHK ERROR: ${err}`);
    });

    // ? This event fires whenever a new download is observed
    oracle.addListener('download.incoming', async (e, downloadItem) => {
        // TODO: add new download to popup UI
        // ! Note how this function is async, which means you can await Promises.
        // ! You should use async/await syntax to ensure the extension waits for
        // ! the UI to finish before continuing
        console.log(`file "${downloadItem.filename}" incoming`);
    });

    // ? This event fires whenever a suspicious originDomain needs to be
    // ? verified manually by the user
    oracle.addListener('download.suspiciousOrigin', async (e, downloadItem) => {
        // TODO: must ask user to approve downloadItem.urlDomain via the UI
        // ! Note how this function is async, which means you can await Promises.
        // ! You should use async/await syntax to ensure the extension waits for
        // ! the UI to finish before continuing
        console.log(`file "${downloadItem.filename}" flagged for suspicious origin`);
    });

    // ? This event fires whenever dnschk decides it cannot judge a download
    oracle.addListener('judgement.unknown', downloadItem => {
        // TODO: update global badge; update download's status/icon/judgement in popup UI
        console.log(`file "${downloadItem.filename}" judgement: UNKNOWN`);
    });

    // ? This event fires whenever dnschk decides a download is safe
    oracle.addListener('judgement.safe', downloadItem => {
        // TODO: update global badge; update download's status/icon/judgement in popup UI
        console.log(`file "${downloadItem.filename}" judgement: SAFE`);
    });

    // ? This event fires whenever dnschk decides a download is NOT safe
    oracle.addListener('judgement.unsafe', downloadItem => {
        // TODO: update global badge; update download's status/icon/judgement in popup UI
        console.log(`file "${downloadItem.filename}" judgement: UNSAFE`);
    });
};
