/* @flow */

/**
 * This class represents a default event frame. It is similar in intent to the
 * DOM's event interface.
 *
 * * See also: https://developer.mozilla.org/en-US/docs/Web/API/Event
 */
export default class EventFrame {
    name: string = '<unknown>';
    stopped = false;
    finished = false;
    _finished: any;
    _continueFn: Function;
    _finishedFn: Function;

    constructor(continueFn: ?Function, finishedFn: ?Function) {
        this._continueFn = continueFn || (() => {});
        this._finishedFn = finishedFn || (() => {});
    }

    /**
     * Interrupt the event loop. The `continue()` and `finish()` methods will
     * not be called (but can be called manually).
     */
    stop() {
        return this.stopped = true;
    }

    /**
     * This method is called after each registered listener is run so long as
     * `stopped` remains false.
     *
     * @param  {*} [args]
     */
    continue(...args: Array<any>) {
        return this._continueFn(...args);
    }

    /**
     * This method is called automatically after all listeners are finished if
     * `stopped` is false. Also, this method is idempotent.
     *
     * @param  {*} [args]
     */
    finish(...args: Array<any>) {
        if(!this.finished)
        {
            this.finished = true;
            this._finished = this._finishedFn(...args);
        }

        return this._finished;
    }
}
