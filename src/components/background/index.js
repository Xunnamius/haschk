/** @flow
 * @description HASCHK background functionality
 * @name Background
 */

import {
    Debug,
    FRAMEWORK_EVENTS
} from 'universe'

import { EventEmitter } from 'universe/events'

import registerChromeEvents from 'components/background/events.chrome'
import registerCoreEvents from 'components/background/events.core'
import registerUIEvents from 'components/background/events.ui'

const oracle = new EventEmitter(FRAMEWORK_EVENTS);
const context = {
    // ? (download) id -> DownloadItem
    downloadItems: new Map(),

    // ? requestId -> request stack [req n, ..., req 1]
    // ! Limited to 1000 requests!
    navHistory: new Map()
};

declare var chrome: any;

Debug.if(() => console.warn('!! == HASCHK IS IN DEVELOPER MODE == !!'));

registerChromeEvents(oracle, chrome, context);
registerCoreEvents(oracle, chrome, context);
registerUIEvents(oracle, chrome, context);
