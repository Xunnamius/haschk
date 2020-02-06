/* @flow */

import EventEmitter from 'eventemitter3'
import { EventFrame } from 'universe/events'
import type { ListenerFn } from 'universe/events'

// TODO: document me!

const asyncEmit = async (index: number, listeners: Array<ListenerFn>, eventFrame: EventFrame, args: Array<any>) => {
    const handler: ?ListenerFn = listeners[index];

    if(!handler)
        return Promise.resolve();

    await Promise.resolve(handler(eventFrame, ...args));
    await asyncEmit(index + 1, listeners, eventFrame, args); // ? I've unwound the loop here and made each iteration async!
};

/**
 * Modify a listener to interrupt event loop when EventFrames are stop()ed
 *
 * @param {ListenerFn} listener
 */
const asyncifyListener = (listener: ListenerFn) => {
    const handlerActual = listener;

    return async (eventFrame: EventFrame, ...args: Array<any>) => {
        await Promise.resolve(eventFrame.stopped || handlerActual(eventFrame, ...args));
        await Promise.resolve(eventFrame.continue());
    };
};

export default class FrameworkEventEmitter extends EventEmitter {
    constructor(...args: Array<any>) {
        super(...args);
    }

    // ? Modify emit to handle async handlers and errors in handlers
    async emit(event: string, eventFrame: EventFrame, ...args: Array<any>) {
        try {
            await asyncEmit(0, this.listeners(event), eventFrame, args);
            await Promise.resolve(eventFrame.finish());
        }

        catch(error) {
            error.eventName = event;
            error.eventArgs = args;

            return super.emit('error', error);
        }
    }

    /**
     * See https://nodejs.org/api/events.html#events_emitter_addlistener_eventname_listener
     *
     * Modifies a listener to interrupt event loop when EventFrames are
     * stop()ed.
     *
     * The listener should have the following function signature:
     * (eventFrame: EventFrame, ...args: Array<any>) => { ... }
     *
     * @param {string} eventName
     * @param {ListenerFn} listener
     */
    addListener(eventName: string | Symbol, listener: ListenerFn) {
        return super.addListener(eventName, asyncifyListener(listener));
    }
}
