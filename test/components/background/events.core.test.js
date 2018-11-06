/* @flow */

import { FRAMEWORK_EVENTS } from 'universe'
import registerCoreEvents from 'components/background/events.core'

const oracle = {};
const chrome = {};

const context = {
    handledDownloadItems: new Set(),
    judgedDownloadItems: [],
    registeredPorts: [],
    activePorts: [],
    timingData: {}
};

registerCoreEvents(oracle, chrome, context);

// TODO: tests!
