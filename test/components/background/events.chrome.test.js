/* @flow */

import { FRAMEWORK_EVENTS } from 'universe'
import registerChromeEvents from 'components/background/events.chrome'

const oracle = {};
const chrome = {};
const context = { handledDownloadItems: new Set() };

registerChromeEvents(oracle, chrome, context);

// TODO: tests!
