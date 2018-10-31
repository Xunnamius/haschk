/* @flow */

import EventFrame from './EventFrame'
import type { FrameworkEventEmitter } from 'universe/events'

// TODO: document me!

export default class InterruptibleEventFrame extends EventFrame {
    _oracle: FrameworkEventEmitter;

    constructor(oracle: FrameworkEventEmitter, cnt: ?Function, fin: ?Function) {
        super(
            cnt || (() => {}),
            fin || (() => {})
        );

        this._oracle = oracle;
    }

    async shortCircuitEventLoop(eventName: string, ...args: Array<any>) {
        this.stop();
        await Promise.resolve(this.finish(...args));
        await this._oracle.emit(eventName, ...args);
    }
}
