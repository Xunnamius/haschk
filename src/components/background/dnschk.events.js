/** @flow
 * @description All DNSCHK event hooks go here, including popup/options hooks
 */

import {
    icons,
    getIcon
} from 'dnschk-utils'

// ? `oracle` emits the events that you should be hooking into. Feel free to add
// ? more events as they become necessary.
// ?
// ? Currently, events include:
// ?    * origin.resolving      origin domain resolution logic should run now
// ?    * origin.resolved       origin domain has been resolved (or error)
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
    oracle.addListener('judgement.unknown', downloadItem => {
        console.log(`file "${downloadItem.filename}" judgement: UNKNOWN`);
        chrome.browserAction.setIcon({ path: getIcon(icons.neutral) });
    });

    oracle.addListener('judgement.safe', downloadItem => {
        console.log(`file "${downloadItem.filename}" judgement: SAFE`);
        chrome.browserAction.setIcon({ path: getIcon(icons.safe) });
    });

    oracle.addListener('judgement.unsafe', downloadItem => {
        console.log(`file "${downloadItem.filename}" judgement: UNSAFE`);
        chrome.browserAction.setIcon({ path: getIcon(icons.unsafe) });
    });
};
