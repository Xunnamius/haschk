/* @flow */

// TODO: document me!

export default class EventFrame extends Promise {
    stopped = false;
    _continueFn: HandlerFn;
    _finishedFn: HandlerFn;

    constructor(continueFn: HandlerFn, finishedFn: HandlerFn) {
        super();

        this._continueFn = continueFn;
        this._finishedFn = finishedFn;
    }

    continue(...args: Array<any>) {
        this._continueFn(...args);
    }

    stop() {
        this.stopped = true;
    }

    // ? Should always be called eventually
    finish(...args: Array<any>) {
        this._finishedFn(...args);
    }
}

export type HandlerFn = (...args: Array<any>) => void;
