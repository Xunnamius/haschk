/* @flow */

import { FRAMEWORK_EVENTS } from 'universe'
import registerCoreEvents from '../../../src/components/background/events.core'

const oracle = {};
const chrome = {};
const context = { handledDownloadItems: new Set() };

registerCoreEvents(oracle, chrome, context);

// TODO: tests! (be sure to re-enable these tests via package.json jest testPathIgnorePatterns)
