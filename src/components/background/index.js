/** @flow
 * @description DNSCHK background functionality
 * @name Background
 */

import { EventEmitter } from 'dnschk-utils/events'

import registerChromeEvents from './events.chrome'
import registerCoreEvents from './events.core'
import registerUIEvents from './events.ui'

declare var chrome:any;

const oracle = new EventEmitter();

registerChromeEvents(oracle, chrome);
registerCoreEvents(oracle, chrome);
registerUIEvents(oracle, chrome);
