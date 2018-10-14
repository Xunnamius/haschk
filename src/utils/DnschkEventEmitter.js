/* @flow */

import EventEmitter from 'eventemitter3'
import EventFrame from './EventFrame';

// TODO: document me!

export default class DnschkEventEmitter extends EventEmitter {
    _frameworkEvents = [];

    constructor(frameworkEvents: Array<string>, ...args: Array<any>) {
        super(...args);
        this._frameworkEvents = frameworkEvents;
    }

    // ? Modify emit to handle errors in event handlers
    emit(event: string, ...args: Array<any>): this {
        try {
            super.emit(event, ...args);
        }

        catch(error) {
            error.eventName = event;
            error.eventArgs = args;

            super.emit('error', error);
        }

        return this;
    }

    // ? Modify addListener to stop event chains when event frames call stop()
    addListener(eventName: any, eventHandler: any): this {
        if(this._frameworkEvents.includes(eventName)) {
            const handlerActual = eventHandler;
            eventHandler = (eventFrame: EventFrame, ...args: Array<any>): void => {
                if(!eventFrame.stopped)
                    handlerActual(eventFrame, ...args);
            }
        }

        super.addListener(eventName, eventHandler);
        return this;
    }
}
