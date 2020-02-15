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

    test(`::addListener(${EVENT_NAME}, listener) works with synchronous listeners`, () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(EVENT_NAME, () => worked = true);
        oracle.emit(EVENT_NAME);

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

describe('::addGlobalListener', () => {
    test(`::addGlobalListener(listener) works with synchronous listeners that return a Promise`, async () => {
        const oracle = oracleFactory();
        let worked = false;
        let promise = null;

        oracle.addGlobalListener(listenerFactory.returnsPromise(() => worked = true));
        promise = oracle.emit(EVENT_NAME);

        expect(worked).toBe(false);

        await promise;
        expect(worked).toBe(true);
    });

    test(`::addGlobalListener(listener) works with synchronous listeners`, () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addGlobalListener(() => worked = true);
        oracle.emit(EVENT_NAME);

        expect(worked).toBe(true);
    });

    test(`::addGlobalListener(listener) works with asynchronous listeners`, async () => {
        const oracle = oracleFactory();
        let worked = false;
        let promise = null;

        oracle.addGlobalListener(listenerFactory.async(() => worked = true));
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

    test(`::emit(${EVENT_NAME}) eventFrame.name set to "${EVENT_NAME}"`, () => {
        const oracle = oracleFactory();
        let E = {};

        oracle.addListener(EVENT_NAME, e => E = e);
        oracle.emit(EVENT_NAME);

        expect(E.name).toBe(EVENT_NAME);
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

    test(`::emit(${EVENT_NAME}, eventFrame) calls listener(EventFrame)`, async () => {
        const oracle = oracleFactory();
        const eventFrame = new EventFrame();
        let worked = false;

        oracle.addListener(EVENT_NAME, e => {
            expect(e).toBe(eventFrame);
            worked = true;
        });

        await oracle.emit(EVENT_NAME, eventFrame);
        expect(worked).toBe(true);
    });

    test(`::emit(${EVENT_NAME}, eventFrame) eventFrame.name is not mutated`, () => {
        const oracle = oracleFactory();
        const eventFrame = new EventFrame();

        eventFrame.name = 'test';
        oracle.addListener(EVENT_NAME, () => {});

        oracle.emit(EVENT_NAME, eventFrame);
        expect(eventFrame.name).toBe('test');
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

    test.todo(`::emit() is a no-op if there are no listeners`);
});

describe('::emitIgnoreGlobalListeners', () => {
    test.todo(`(all the same tests as emit go here)`);
});

describe('::removeListener', () => {
    test.todo(`::removeListener()  removes addListener`);
    test.todo(`::removeListener()  removes once`);
});

describe('::removeGlobalListener', () => {
    test.todo(`::removeGlobalListener() removes addGlobalListener`);
});

describe('::once', () => {
    test.todo(`::once() listener() is only executed once`);
});

describe('::on', () => {
    test.todo(`::on() works identical to ::addListener()`);
});

describe('EventFrame', () => {
    test(`::constructor() initializes with ::name = '<unknown>'`, () => {
        expect((new EventFrame()).name).toBe('<unknown>');
    });

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

        oracle.addGlobalListener(() => worked = true);
        oracle.addGlobalListener(e => e.stop());
        oracle.addGlobalListener(() => worked = false);

        oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test.todo(`::continue() is called after each listener fires (including global)`);
    test.todo(`::finish() is called once after all listeners have fired (including global)`);
})
