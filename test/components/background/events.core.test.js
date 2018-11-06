/* @flow */

import { FRAMEWORK_EVENTS } from 'universe'
import registerCoreEvents from 'components/background/events.core'

const oracle = {};
const chrome = {};
const context = { handledDownloadItems: new Set() };

registerCoreEvents(oracle, chrome, context);

// TODO: tests!
