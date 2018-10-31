/* @flow */

import { FRAMEWORK_EVENTS } from 'universe'
import registerUIEvents from '../../../src/components/background/events.ui'

const oracle = {};
const chrome = {};
const context = { handledDownloadItems: new Set() };

registerUIEvents(oracle, chrome, context);

// TODO: tests! (be sure to re-enable these tests via package.json jest testPathIgnorePatterns)