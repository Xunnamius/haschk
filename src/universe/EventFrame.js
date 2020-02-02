/* @flow */

// TODO: document me!

export default class EventFrame {
    stopped = false;
    finished = false;
    _finished: any;
    _continueFn: Function;
    _finishedFn: Function;

    constructor(continueFn: Function, finishedFn: Function) {
        this._continueFn = continueFn;
        this._finishedFn = finishedFn;
    }

    continue(...args: Array<any>) {
        this._continueFn(...args);
    }

    stop() {
        this.stopped = true;
    }

    // ? Should always be called eventually; is idempotent
    finish(...args: Array<any>) {
        if(!this.finished)
        {
            this.finished = true;
            this._finished = this._finishedFn(...args);
        }

        return this._finished;
    }
}
