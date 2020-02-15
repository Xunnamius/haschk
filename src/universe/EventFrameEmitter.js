/* @flow */

import EventEmitter from 'eventemitter3'
import { EventFrame } from 'universe/events'
import type { ListenerFn } from 'universe/events'

/**
 * Unwinds the event loop so that each event listener is await-ed
 * "synchronously".
 *
 * @param {EventFrameEmitter} emitter   Which emitter we're emitting with
 * @param {Number} index                Where we are in the array of listeners
 * @param {Array<ListenerFn>} listeners Said array of listeners
 * @param {EventFrame} eventFrame       The EventFrame instance
 * @param {*} [args]                    Any arguments passed on to the listeners
 */
const asyncEmit = async (emitter: EventFrameEmitter,
                         index: number,
                         listeners: Array<ListenerFn>,
                         eventFrame: EventFrame,
                         args: Array<any>) =>
{
    const listener: ?ListenerFn = listeners[index];

    if(listener)
    {
        if(listener.$once)
            emitter.removeListener(eventFrame.name, listener, undefined, true);

        await listener(eventFrame, ...args);
        !eventFrame.stopped && await asyncEmit(emitter, index + 1, listeners, eventFrame, args);
    }
};

/**
 * Modify a listener to interrupt the event loop when EventFrames are
 * `stop()`-ed
 *
 * @param {ListenerFn} listener
 * @param {boolean} [once=false]
 */
const asyncifyListener = (listener: ListenerFn, once: ?boolean) => {
    const listenerActual = listener;

    listener = async (eventFrame: EventFrame, ...args: Array<any>) => {
        await listenerActual(eventFrame, ...args);
        !eventFrame.stopped && await eventFrame.continue();
    };

    listener.$once = once || false;
    return listener;
};

/**
 * An extension of `EventEmitter3`, based on the NodeJS EventEmitter, that
 * additionally supports async functions as listeners and awaits them as one
 * would expect. Also supports global listeners that react to all events.
 *
 * * See also: https://github.com/primus/eventemitter3
 */
export default class EventFrameEmitter extends EventEmitter {
    _globalListeners: Set<ListenerFn> = new Set();

    constructor(...args: Array<any>) {
        super(...args);
    }

    async _emit(eventName: string, args: Array<any>, ignoreGlobalListeners: boolean) {
        const eventFrame = args[0] instanceof EventFrame ? args[0] : new EventFrame();
        const listeners = this.listeners(eventName);

        if(!listeners && (ignoreGlobalListeners || !this._globalListeners.size))
            return false;

        try {
            eventFrame.name === '<unknown>' && (eventFrame.name = eventName);

            if(!ignoreGlobalListeners) {
                for (const listener of this._globalListeners) {
                    await listener(eventFrame, args);

                    if(eventFrame.stopped)
                        return true;
                }
            }

            await asyncEmit(this, 0, listeners, eventFrame, args);
            !eventFrame.stopped && await eventFrame.finish();
        }

        catch(error) {
            eventFrame.name = `[error] ${eventFrame.name}`;
            eventFrame.stop();

            super.emit('error', eventFrame, error, args);
        }

        return true;
    }

    /**
     * "Synchronously" calls each of the async listeners registered for the
     * event named eventName, in the order they were registered, passing the
     * EventFrame and supplied arguments to each.
     *
     * Returns `true` if the event had listeners and `false` otherwise. If there
     * are global listeners present, this method will always return true.
     *
     * * For more details, see: https://nodejs.org/api/events.html
     *
     * @param {String} eventName
     * @param {*} [args]
     */
    async emit(eventName: string, ...args: Array<any>) {
        return await this._emit(eventName, args, false);
    }

    /**
     * Same as `emit()` except global listeners will not be called. Use this
     * method to avoid infinite loops of event handlers calling each other.
     *
     * Returns `true` if the event had listeners and `false` otherwise. Global
     * listeners do not factor into this calculation.
     *
     * @param {String} eventName
     * @param {*} [args]
     */
    async emitIgnoreGlobalListeners(eventName: string, ...args: Array<any>) {
        return await this._emit(eventName, args, true);
    }

    /**
     * Adds a listener that will interrupt the event loop if the EventFrame is
     * `stop()`-ed. Note that calls to `removeListener()` should pass in the
     * return value of this function as the listener to be removed.
     *
     * Note that the first argument passed to the listener is an EventFrame
     * instance followed by any additional arguments.
     *
     * * For more details, see: https://nodejs.org/api/events.html
     *
     * @param {String} eventName
     * @param {ListenerFn} listener
     * @param {object} context
     */
    addListener(eventName: string | Symbol, listener: ListenerFn, context: ?{}) {
        listener = eventName.toString() == 'error' ? listener : asyncifyListener(listener);
        super.addListener(eventName, listener, context);

        return listener;
    }

    /**
     * Same functionality as `addListener()` except this event listener will be
     * fired on every emission. Note that calls to `removeGlobalListener()`
     * should pass in the return value of this function as the listener to be
     * removed.
     *
     * Listeners should have the following function signature:
     *   (eventFrame: EventFrame, args: Array<any>) => { ... }
     *
     * ! Note that global listeners are always called BEFORE other listeners!
     *
     * @param {ListenerFn} listener
     */
    addGlobalListener(listener: ListenerFn) {
        listener = asyncifyListener(listener);
        this._globalListeners.add(listener);

        return listener;
    }

    /**
     * Removes the specified listener from the global array of listeners. This
     * method returns `true` if the listener was successfully removed and
     * `false` otherwise.
     *
     * @param {ListenerFn} listener
     */
    removeGlobalListener(listener: ListenerFn) {
        return this._globalListeners.delete(listener);
    }

    /**
     * Same as `addListener()` except, after a single invocation, the listener
     * is removed.
     *
     * @param {String} eventName
     * @param {ListenerFn} listener
     * @param {object} context
     */
    once(eventName: string | Symbol, listener: ListenerFn, context: ?{}) {
        listener = eventName.toString() == 'error' ? listener : asyncifyListener(listener, true);
        super.once(eventName, listener, context);

        return listener;
    }

    /**
     * Alias of `addListener()`.
     *
     * @param {String} eventName
     * @param {ListenerFn} listener
     * @param {object} context
     */
    on(...args: Array<any>) {
        return this.addListener(...args);
    }
}
