/* @flow */

import EventEmitter from 'eventemitter3'
import EventFrame from './EventFrame';

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

// TODO: document me!

const checkEventFrame = (eventName: string, eventFrame: EventFrame) => {
    if(!(eventFrame instanceof EventFrame))
    {
        throw new TypeError(
            `first argument (arg1) passed to handlers via emit('${eventName}', arg1, ...) `
        +`must be an EventFrame instance, got ${eventFrame} instead`
        );
    }
}

export default class DnschkEventEmitter extends EventEmitter {
    _frameworkEvents = [];

    constructor(frameworkEvents: ?Array<string>, ...args: Array<any>) {
        super(...args);
        this._frameworkEvents = frameworkEvents || [];
    }

    // ? Modify emit to handle async handlers and errors in handlers
    // flow-disable-line
    emit(event: string, ...args: Array<any>): Promise<void> {
        try {
            const listeners = this.listeners(event);

            const asyncEmit = (index: number): Promise<void> => {
                const handler: ?any = listeners[index];
                let retPromise: Promise<void>;

                if(!handler)
                    return Promise.resolve();

                if(handler instanceof AsyncFunction)
                    retPromise = handler(...args);

                else
                {
                    retPromise = new Promise(resolve => {
                        handler(...args);
                        resolve();
                    });
                }

                return retPromise.then(() => asyncEmit(index + 1), e => { throw e; });
            };

            return asyncEmit(0);
        }

        catch(error) {
            error.eventName = event;
            error.eventArgs = args;

            super.emit('error', error);
        }
    }

    // ? Modify addListener to stop event chains when event frames are stopped
    addListener(eventName: string | Symbol, eventHandler: any): this {
        if(this._frameworkEvents.includes(eventName)) {
            const handlerActual = eventHandler;

            if(handlerActual instanceof AsyncFunction)
            {
                eventHandler = async (eventFrame: EventFrame, ...args: Array<any>) => {
                    checkEventFrame(eventName.toString(), eventFrame);
                    await !eventFrame.stopped ? handlerActual(eventFrame, ...args) : Promise.resolve();
                }
            }

            else
            {
                eventHandler = (eventFrame: EventFrame, ...args: Array<any>) => {
                    checkEventFrame(eventName.toString(), eventFrame);

                    if(!eventFrame.stopped)
                        handlerActual(eventFrame, ...args);
                }
            }
        }

        super.addListener(eventName, eventHandler);
        return this;
    }
}
