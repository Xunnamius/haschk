/* @flow */

import { FRAMEWORK_EVENTS } from 'universe'
import registerUIEvents from 'components/background/events.ui'

const oracle = {};
const chrome = {};
const context = { handledDownloadItems: new Set() };

registerUIEvents(oracle, chrome, context);

// TODO: tests!
