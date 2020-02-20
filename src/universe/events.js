/** @flow
 *  @description These are utility functions and constants for our event system
 */

import EventFrame from './EventFrame'
import EventFrameEmitter from './EventFrameEmitter'

export type { ListenerFn } from 'eventemitter3';

/**
 * Translates an eventFrame and associated data into a message to be sent over a
 * Port.
 *
 * * See also: https://developer.chrome.com/extensions/runtime#type-Port
 *
 * @param {EventFrame} eventFrame
 * @param {*} [args]
 */
export const eventFrameToPortMessage = (eventFrame: EventFrame, args: Array<any>) => ({ eventFrame, args });

/**
 * Translates the message data received through a port into an EventFrame. Any
 * associated data (i.e. args) is also unserialized.
 *
 * Returns an object of the form `{ eventFrame: EventFrame, args: Array<any> }`
 *
 * @param {Object} data
 */
export const portMessageToEventFrame = ({ eventFrame, args }: { eventFrame: {}, args: Array<any> }) => {
    return {
        eventFrame: Object.assign(new EventFrame, eventFrame),
        args
    };
};

export {
    EventFrame,
    EventFrameEmitter,
};
