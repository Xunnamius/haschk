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
import registerBridgeEvents from './events.bridge'

declare var chrome:any;

const oracle = new EventEmitter(FRAMEWORK_EVENTS);
const context = {
    handledDownloadItems: new Set(),
    judgedDownloadItems: {},
    timingData: {}
};

registerChromeEvents(oracle, chrome, context);
registerCoreEvents(oracle, chrome, context);
registerUIEvents(oracle, chrome, context);
registerBridgeEvents(oracle, chrome, context);
