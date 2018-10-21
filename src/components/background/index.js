/** @flow
 * @description DNSCHK background functionality
 * @name Background
 */

// flow-disable-line
import { FRAMEWORK_EVENTS } from 'universe'
// flow-disable-line
import { EventEmitter } from 'universe/events'

import registerChromeEvents from './events.chrome'
import registerCoreEvents from './events.core'
import registerUIEvents from './events.ui'

declare var chrome:any;

const oracle = new EventEmitter(FRAMEWORK_EVENTS);
const context = {
    handledDownloadItems: new Set()
};

// TODO: configure storage dictionaries

registerChromeEvents(oracle, chrome, context);
registerCoreEvents(oracle, chrome, context);
registerUIEvents(oracle, chrome, context);
