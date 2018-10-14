/** @flow
 * @description DNSCHK background functionality
 * @name Background
 */

// flow-disable-line
import { FRAMEWORK_EVENTS } from 'dnschk-utils'
// flow-disable-line
import { EventEmitter } from 'dnschk-utils/events'

import registerChromeEvents from './events.chrome'
import registerCoreEvents from './events.core'
import registerUIEvents from './events.ui'

declare var chrome:any;

const oracle = new EventEmitter(FRAMEWORK_EVENTS);
const context = {
    handledDownloadItems: new Set()
};

registerChromeEvents(oracle, chrome, context);
registerCoreEvents(oracle, chrome, context);
registerUIEvents(oracle, chrome, context);
