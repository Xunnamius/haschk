/** @flow
 * @description utility EventEmitter that works on browsers and in node
 */

import EventEmitter from 'eventemitter3'

class DnschkEventEmitter extends EventEmitter {
    constructor(...args) {
        super(...args);
    }

    emit(event, ...args) {
        try {
            super.emit(event, ...args);
        }

        catch(error) {
            error.eventName = event;
            error.eventArgs = args;

            super.emit('error', error);
        }
    }
}

export { DnschkEventEmitter as EventEmitter };
