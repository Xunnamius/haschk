/* @flow */

import * as Promise from 'bluebird'

import {
    EventFrame,
    EventFrameEmitter,
} from 'universe/events'

const EVENT_NAME = 'testEvent';
const DEFAULT_DELAY = 50;

const oracleFactory = () => new EventFrameEmitter();

const listenerFactory = {
    returnsPromise: (fn: Function, d: ?number) => (...args) => Promise.delay(d || DEFAULT_DELAY).then(() => fn(args)),
    async: (fn: Function, d: ?number) => async (...args) => { await Promise.delay(d || DEFAULT_DELAY); fn(args); },
};

describe('::addListener', () => {
    test(`::addListener(${EVENT_NAME}, listener) works with synchronous listeners that return a Promise`, async () => {
        const oracle = oracleFactory();
        let worked = false;
        let promise = null;

        oracle.addListener(EVENT_NAME, listenerFactory.returnsPromise(() => worked = true));
        promise = oracle.emit(EVENT_NAME);

        expect(worked).toBe(false);

        await promise;
        expect(worked).toBe(true);
    });

    test(`::addListener(${EVENT_NAME}, listener) works with synchronous listeners`, async () => {
        const oracle = oracleFactory();
        let worked = false;
        let promise = null;

        oracle.addListener(EVENT_NAME, () => worked = true);
        promise = oracle.emit(EVENT_NAME);

        await promise;
        expect(worked).toBe(true);
    });

    test(`::addListener(${EVENT_NAME}, listener) works with asynchronous listeners`, async () => {
        const oracle = oracleFactory();
        let worked = false;
        let promise = null;

        oracle.addListener(EVENT_NAME, listenerFactory.async(() => worked = true));
        promise = oracle.emit(EVENT_NAME);

        expect(worked).toBe(false);

        await promise;
        expect(worked).toBe(true);
    });
});

describe('::emit', () => {
    test(`::emit(${EVENT_NAME}) listeners emit error event on throw`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(EVENT_NAME, () => { throw new Error('exception'); });
        oracle.addListener('error', () => worked = true);

        await oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test(`::emit(${EVENT_NAME}) calls listener(EventFrame)`, () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(EVENT_NAME, e => {
            expect(e).toBeInstanceOf(EventFrame);
            worked = true;
        });

        oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test(`::emit(${EVENT_NAME}, ...args) calls listener(EventFrame, ...args)`, () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(EVENT_NAME, (e, f, g) => {
            expect(e).toBeInstanceOf(EventFrame);
            expect(f).toBe(1);
            expect(g).toBe(2);
            worked = true;
        });

        oracle.emit(EVENT_NAME, 1, 2);
        expect(worked).toBe(true);
    });

    test(`::emit(${EVENT_NAME}, eventFrame, ...args) calls listener(EventFrame, ...args)`, async () => {
        const oracle = oracleFactory();
        const eventFrame = new EventFrame();
        let worked = false;

        oracle.addListener(EVENT_NAME, (e, f, g) => {
            expect(e).toBe(eventFrame);
            expect(f).toBe(1);
            expect(g).toBe(2);
            worked = true;
        });

        await oracle.emit(EVENT_NAME, eventFrame, 1, 2);
        expect(worked).toBe(true);
    });
});

describe('EventFrame', () => {
    test(`::stop() interrupts event loop`, () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(EVENT_NAME, () => worked = true);
        oracle.addListener(EVENT_NAME, e => e.stop());
        oracle.addListener(EVENT_NAME, () => worked = false);

        oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test(`::stop() interrupts event loop for global listeners`, () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(EVENT_NAME, () => worked = true);
        oracle.addListener(EVENT_NAME, e => e.stop());
        oracle.addListener(EVENT_NAME, () => worked = false);

        oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });
})
