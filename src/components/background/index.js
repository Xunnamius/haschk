/** @flow
 * @description HASCHK background functionality
 * @name Background
 */

import { FRAMEWORK_EVENTS } from 'universe'
import { EventEmitter } from 'universe/events'

import registerChromeEvents from 'components/background/events.chrome'
import registerCoreEvents from 'components/background/events.core'
import registerUIEvents from 'components/background/events.ui'

declare var chrome: any;
export type Chrome = chrome;

const oracle = new EventEmitter(FRAMEWORK_EVENTS);
const context = {
    handledDownloadItems: new Set(),
    judgedDownloadItems: [],
    seenPorts: {},
    navHistory: {}
};

registerChromeEvents(oracle, chrome, context);
registerCoreEvents(oracle, chrome, context);
registerUIEvents(oracle, chrome, context);
