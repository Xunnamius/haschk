/** @flow
 * @description DNSCHK background functionality
 * @name Background
 */

import { EventEmitter } from 'dnschk-utils/events'

import registerChromeEvents from './chrome.events'
import registerCoreEvents from './core.events'
import registerUIEvents from './ui.events'

declare var chrome:any;

const oracle = new EventEmitter();

registerChromeEvents(oracle, chrome);
registerCoreEvents(oracle, chrome);
registerUIEvents(oracle, chrome);
