/* @flow */

import EventEmitter from 'eventemitter3'
import { EventFrame } from 'universe/events'
import type { ListenerFn as SuperListenerFn } from 'eventemitter3'
import type { ListenerFn } from 'universe/events'

// TODO: document me!

const asyncEmit = async (index: number, listeners: Array<ListenerFn>, args: Array<any>) => {
    const handler: ?ListenerFn = listeners[index];

    if(!handler)
        return Promise.resolve();

    await Promise.resolve(handler(...args));
    await asyncEmit(index + 1, listeners, args); // ? I've unwound the loop here and made each iteration async!
};

const checkEventFrame = (eventName: string, eventFrame: EventFrame) => {
    if(typeof eventFrame.stopped !== 'boolean')
    {
        throw new TypeError(
            `first argument (arg1) passed to handlers via emit('${eventName}', arg1, ...) `
           +`must be an EventFrame instance or expose compatible interface, got ${eventFrame.toString()} instead`
        );
    }
}

export default class FrameworkEventEmitter extends EventEmitter {
    _frameworkEvents = [];

    constructor(frameworkEvents: ?Array<string>, ...args: Array<any>) {
        super(...args);
        this._frameworkEvents = frameworkEvents || [];
    }

    // ? Modify emit to handle async handlers and errors in handlers
    // flow-disable-line
    async emit(event: string, ...args: Array<any>) {
        try {
            await asyncEmit(0, ((this.listeners(event): any): Array<ListenerFn>), args);
        }

        catch(error) {
            error.eventName = event;
            error.eventArgs = args;

            super.emit('error', error);
        }
    }

    // ? Modify addListener to interrupt event loop when EventFrames are stop()ed
    addListener(eventName: string | Symbol, eventHandler: ListenerFn, context: ?{}, prepend: ?boolean) {
        if(this._frameworkEvents.includes(eventName)) {
            const handlerActual = eventHandler;

            eventHandler = async (eventFrame: EventFrame, ...args: Array<any>) => {
                checkEventFrame(eventName.toString(), eventFrame);
                await Promise.resolve(eventFrame.stopped || handlerActual(eventFrame, ...args));
            }
        }

        super.addListener(eventName, ((eventHandler: any): SuperListenerFn), context);

        if(prepend && !this._events[eventName].fn)
            this._events[eventName] = [this._events[eventName].pop(), ...this._events[eventName]];

        return this;
    }

    prependListener(eventName: string | Symbol, eventHandler: ListenerFn, context: ?{}) {
        return this.addListener(eventName, eventHandler, context, true);
    }
}

FrameworkEventEmitter.prototype.on = FrameworkEventEmitter.prototype.addListener;
FrameworkEventEmitter.prototype.appendListener = FrameworkEventEmitter.prototype.addListener;
