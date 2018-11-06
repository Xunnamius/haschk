/** @flow
 * @description DNSCHK background functionality
 * @name Background
 */

import { FRAMEWORK_EVENTS } from 'universe'
import { EventEmitter } from 'universe/events'

import registerChromeEvents from './events.chrome'
import registerCoreEvents from './events.core'
import registerUIEvents from './events.ui'

declare var chrome:any;

const oracle = new EventEmitter(FRAMEWORK_EVENTS);
const context = {
    handledDownloadItems: new Set(),
    judgedDownloadItems: [],
    registeredPorts: [],
    activePorts: [],
    timingData: {}
};

registerChromeEvents(oracle, chrome, context);
registerCoreEvents(oracle, chrome, context);
registerUIEvents(oracle, chrome, context);
