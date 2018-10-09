/** @flow
 * @description All DNSCHK UI event hooks go here, including for popup/options
 */


// ? `oracle` emits the events that you should be hooking into. Feel free to add
// ? more events as they become necessary.
// ?
// ? Currently, events include:
// ?    * origin.resolving      origin domain resolution logic should run now
// ?    * origin.resolved       origin domain has been resolved successfully
// ?    * download.new          a new download has been observed
// ?    * download.completed    a download has completed
// ?    * judgement.safe        a resource's content is as expected
// ?    * judgement.unsafe      a resource's content is mutated/corrupted
// ?    * judgement.unknown     a resource's content cannot be judged
// ?    * error                 a new error event has occurred
// ?
// ? See ./index.js and other events for examples of what parameters are
// ? available for handlers of the different events.

export default (oracle, chrome) => {
    // ? This is our generic error handler
    oracle.addListener('error', err => {
        // TODO: indicate error condition in the UI
        console.error(`DNSCHK ERROR: ${err}`);
    });

    // TODO: need to document the events and their API (like below) in wiki
    oracle.addListener('download.new', (downloadItem, approve, reject) => {
        if(downloadItem.isCrossOrigin)
        {
            // TODO: must ask user if they approve/reject the download from the
            // TODO: external domain (outside origin)
        }

        // TODO: remove this when above logic is implemented!
        approve();
    });

    oracle.addListener('judgement.unknown', downloadItem => {
        console.log(`file "${downloadItem.filename}" judgement: UNKNOWN`);
    });

    oracle.addListener('judgement.safe', downloadItem => {
        console.log(`file "${downloadItem.filename}" judgement: SAFE`);
    });

    oracle.addListener('judgement.unsafe', downloadItem => {
        console.log(`file "${downloadItem.filename}" judgement: UNSAFE`);
    });
};
