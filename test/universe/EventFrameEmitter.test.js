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

        oracle.addListener(EVENT_NAME, () => worked = true);
        await oracle.emit(EVENT_NAME);

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

    test(`::addGlobalListener(listener) works with synchronous listeners`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addGlobalListener(() => worked = true);
        await oracle.emit(EVENT_NAME);

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
    test(`::emit(${EVENT_NAME}) ${EVENT_NAME} listeners emit error event on throw`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(EVENT_NAME, () => { throw new Error('exception'); });
        oracle.addListener('error', () => worked = true);

        await oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test(`::emit(${EVENT_NAME}) global listeners emit error event on throw`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addGlobalListener(() => { throw new Error('exception'); });
        oracle.addListener('error', () => worked = true);

        await oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test(`::emit(${EVENT_NAME}) error event emission does not trigger global listeners`, async () => {
        const oracle = oracleFactory();
        let worked = true;

        oracle.addListener(EVENT_NAME, () => { throw new Error('exception'); });
        oracle.addGlobalListener(() => worked = false);

        await oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test(`::emit(${EVENT_NAME}) calls ${EVENT_NAME} listener(EventFrame)`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(EVENT_NAME, e => {
            expect(e).toBeInstanceOf(EventFrame);
            worked = true;
        });

        await oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test(`::emit(${EVENT_NAME}) eventFrame.name set to "${EVENT_NAME}"`, async () => {
        const oracle = oracleFactory();
        let E = {};

        oracle.addListener(EVENT_NAME, e => E = e);
        await oracle.emit(EVENT_NAME);

        expect(E.name).toBe(EVENT_NAME);
    });

    test(`::emit(${EVENT_NAME}, ...args) calls ${EVENT_NAME} listener(EventFrame, ...args)`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(EVENT_NAME, (e, f, g) => {
            expect(e).toBeInstanceOf(EventFrame);
            expect(f).toBe(1);
            expect(g).toBe(2);
            worked = true;
        });

        await oracle.emit(EVENT_NAME, 1, 2);
        expect(worked).toBe(true);
    });

    test(`::emit(${EVENT_NAME}, eventFrame) calls ${EVENT_NAME} listener(EventFrame)`, async () => {
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

    test(`::emit(${EVENT_NAME}, eventFrame) eventFrame.name is not mutated`, async () => {
        const oracle = oracleFactory();
        const eventFrame = new EventFrame();

        eventFrame.name = 'test';
        oracle.addListener(EVENT_NAME, () => {});

        await oracle.emit(EVENT_NAME, eventFrame);
        expect(eventFrame.name).toBe('test');
    });

    test(`::emit(${EVENT_NAME}, eventFrame, ...args) calls ${EVENT_NAME} listener(EventFrame, ...args)`, async () => {
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

    test(`::emit(${EVENT_NAME}) is a no-op if there are no ${EVENT_NAME} listeners`, async () => {
        const oracle = oracleFactory();
        let worked = true;

        oracle.addListener(`${EVENT_NAME}2`, () => worked = false);
        await oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test(`::emit(${EVENT_NAME}) calls ${EVENT_NAME} listeners and global listeners in expected order`, async () => {
        const oracle = oracleFactory();
        let worked = '';

        oracle.addGlobalListener(listenerFactory.async(() => worked += 'A', 150), true);
        oracle.addListener(EVENT_NAME, listenerFactory.async(() => worked += 'B', 150));
        oracle.addListener(EVENT_NAME, listenerFactory.async(() => worked += 'C'));
        oracle.addGlobalListener(listenerFactory.async(() => worked += 'D'));

        await oracle.emit(EVENT_NAME);
        expect(worked).toBe('ABCD');
    });

    test(`::emit(${EVENT_NAME}) returns true if there are global or ${EVENT_NAME} listeners and false otherwise`, async () => {
        const oracle1 = oracleFactory();
        const oracle2 = oracleFactory();
        const oracle3 = oracleFactory();
        const oracle4 = oracleFactory();

        oracle1.addGlobalListener(() => {});
        oracle2.addListener(EVENT_NAME, listenerFactory.async(() => {}));
        oracle3.addListener(EVENT_NAME, listenerFactory.async(() => {}));
        oracle3.addGlobalListener(() => {});
        oracle4.addListener(`${EVENT_NAME}2`, listenerFactory.async(() => {}));

        expect(await oracle1.emit(EVENT_NAME)).toBe(true);
        expect(await oracle2.emit(EVENT_NAME)).toBe(true);
        expect(await oracle3.emit(EVENT_NAME)).toBe(true);
        expect(await oracle4.emit(EVENT_NAME)).toBe(false);
    });
});

describe('::emitIgnoreGlobalListeners', () => {
    test(`::emitIgnoreGlobalListeners(${EVENT_NAME}) calls ${EVENT_NAME} listeners and not global listeners`, async () => {
        const oracle = oracleFactory();
        let worked = '';

        oracle.addGlobalListener(() => worked += 'A', true);
        oracle.addListener(EVENT_NAME, listenerFactory.async(() => worked += 'B'));
        oracle.addListener(EVENT_NAME, listenerFactory.async(() => worked += 'C'));
        oracle.addGlobalListener(() => worked += 'D');

        await oracle.emitIgnoreGlobalListeners(EVENT_NAME);
        expect(worked).toBe('BC');
    });

    test(`::emitIgnoreGlobalListeners(${EVENT_NAME}) returns true if there are non-global ${EVENT_NAME} listeners and false otherwise`, async () => {
        const oracle1 = oracleFactory();
        const oracle2 = oracleFactory();

        oracle1.addGlobalListener(() => {});
        oracle1.addListener(EVENT_NAME, listenerFactory.async(() => {}));
        oracle2.addGlobalListener(() => {});

        expect(await oracle1.emitIgnoreGlobalListeners(EVENT_NAME)).toBe(true);
        expect(await oracle2.emitIgnoreGlobalListeners(EVENT_NAME)).toBe(false);
    });
});

describe('::removeListener', () => {
    test(`::removeListener(${EVENT_NAME}) removes listener added by ::addListener()`, async () => {
        const oracle = oracleFactory();
        let worked = true;

        const listener = oracle.addListener(EVENT_NAME, () => worked = false);
        oracle.removeListener(EVENT_NAME, listener);
        await oracle.emit(EVENT_NAME);

        expect(worked).toBe(true);
    });

    test(`::removeListener(${EVENT_NAME}) removes error listener added by ::addListener()`, async () => {
        const oracle = oracleFactory();
        let worked = true;

        oracle.addListener(EVENT_NAME, () => { throw new Error('Error!'); });
        const listener = oracle.addListener('error', () => worked = false);
        oracle.removeListener('error', listener);
        await oracle.emit(EVENT_NAME);

        expect(worked).toBe(true);
    });

    test(`::removeListener(${EVENT_NAME}) removes listener added by ::once()`, async () => {
        const oracle = oracleFactory();
        let worked = true;

        const listener = oracle.once(EVENT_NAME, () => worked = false);
        oracle.removeListener(EVENT_NAME, listener);
        await oracle.emit(EVENT_NAME);

        expect(worked).toBe(true);
    });
});

describe('::removeGlobalListener', () => {
    test(`::removeGlobalListener() removes listener added by ::addGlobalListener()`, async () => {
        const oracle = oracleFactory();
        let worked = true;

        const listener = oracle.addGlobalListener(() => worked = false);

        expect(oracle.removeGlobalListener(listener)).toBe(true);

        await oracle.emit(EVENT_NAME);

        expect(worked).toBe(true);
    });

    test(`::removeGlobalListener() returns false if nothing is removed`, async () => {
        expect((oracleFactory()).removeGlobalListener(() => {})).toBe(false);
    });
});

describe('::removeAllListeners', () => {
    test(`::removeAllListeners() removes all listeners except global listeners`, async () => {
        const oracle = oracleFactory();
        let worked = 0;

        oracle.addGlobalListener(() => worked = 1, true);
        oracle.addGlobalListener(() => worked = 2, true);
        oracle.addListener(EVENT_NAME, () => worked = 3);
        oracle.removeAllListeners();

        await oracle.emit(EVENT_NAME);

        expect(worked).toBe(2);
    });
});

describe('::removeAllGlobalListeners', () => {
    test(`::removeAllGlobalListeners() removes all listeners except non-global listeners`, async () => {
        const oracle = oracleFactory();
        let worked = 0;

        oracle.addListener(EVENT_NAME, () => worked = 1);
        oracle.addListener(EVENT_NAME, () => worked = 2);
        oracle.addGlobalListener(() => worked = 3);
        oracle.removeAllGlobalListeners();

        await oracle.emit(EVENT_NAME);

        expect(worked).toBe(2);
    });
});

describe('::once', () => {
    test(`::once() listener is only executed once`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.once(EVENT_NAME, () => worked = !worked);

        await oracle.emit(EVENT_NAME);
        await oracle.emit(EVENT_NAME);

        expect(worked).toBe(true);
    });
});

describe('::on', () => {
    test(`::on(${EVENT_NAME}, listener) works with synchronous listeners that return a Promise`, async () => {
        const oracle = oracleFactory();
        let worked = false;
        let promise = null;

        oracle.on(EVENT_NAME, listenerFactory.returnsPromise(() => worked = true));
        promise = oracle.emit(EVENT_NAME);

        expect(worked).toBe(false);
        await promise;
        expect(worked).toBe(true);
    });

    test(`::on(${EVENT_NAME}, listener) works with synchronous listeners`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.on(EVENT_NAME, () => worked = true);
        await oracle.emit(EVENT_NAME);

        expect(worked).toBe(true);
    });

    test(`::on(${EVENT_NAME}, listener) works with asynchronous listeners`, async () => {
        const oracle = oracleFactory();
        let worked = false;
        let promise = null;

        oracle.on(EVENT_NAME, listenerFactory.async(() => worked = true));
        promise = oracle.emit(EVENT_NAME);

        expect(worked).toBe(false);
        await promise;
        expect(worked).toBe(true);
    });
});

describe('EventFrame', () => {
    test(`::constructor() initializes with ::name = '<unknown>'`, () => {
        expect((new EventFrame()).name).toBe('<unknown>');
    });

    test(`::stop() interrupts event loop`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(EVENT_NAME, () => worked = true);
        oracle.addListener(EVENT_NAME, e => e.stop());
        oracle.addListener(EVENT_NAME, () => worked = false);

        await oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test(`::stop() interrupts event loop for global listeners`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addGlobalListener(() => worked = true);
        oracle.addGlobalListener(e => e.stop());
        oracle.addGlobalListener(() => worked = false);

        await oracle.emit(EVENT_NAME);
        expect(worked).toBe(true);
    });

    test(`::stop() prevents ::finish() from being called`, async () => {
        let worked = true;
        let oracle = oracleFactory();
        let eventFrame = new EventFrame(undefined, () => worked = false);

        oracle.addListener(EVENT_NAME, e => e.stop());
        await oracle.emit(EVENT_NAME, eventFrame);

        expect(worked).toBe(true);

        oracle = oracleFactory();
        eventFrame = new EventFrame(undefined, () => worked = false);

        oracle.addGlobalListener(e => e.stop());
        await oracle.emit(EVENT_NAME, eventFrame);

        expect(worked).toBe(true);
    });

    test(`::stop() prevents ::continue() from being called`, async () => {
        let worked = true;
        let oracle = oracleFactory();
        let eventFrame = new EventFrame(() => worked = false, undefined);

        oracle.addListener(EVENT_NAME, e => e.stop());
        await oracle.emit(EVENT_NAME, eventFrame);

        expect(worked).toBe(true);

        oracle = oracleFactory();
        eventFrame = new EventFrame(() => worked = false, undefined);

        oracle.addGlobalListener(e => e.stop());
        await oracle.emit(EVENT_NAME, eventFrame);

        expect(worked).toBe(true);
    });

    test(`::continue() is called after each listener fires (including global)`, async () => {
        let worked = 0;
        let oracle = oracleFactory();
        let eventFrame = new EventFrame(() => worked++, undefined);

        oracle.addListener(EVENT_NAME, () => {});
        oracle.addListener(EVENT_NAME, () => {});
        oracle.addGlobalListener(() => {});
        oracle.addListener(EVENT_NAME, () => {});

        await oracle.emit(EVENT_NAME, eventFrame);

        expect(worked).toBe(4);
    });

    test(`::finish() is called once after all listeners have fired (including global)`, async () => {
        let worked = 0;
        let oracle = oracleFactory();
        let eventFrame = new EventFrame(undefined, () => worked++);

        oracle.addListener(EVENT_NAME, () => {});
        oracle.addListener(EVENT_NAME, () => {});
        oracle.addGlobalListener(() => {});
        oracle.addListener(EVENT_NAME, () => {});

        await oracle.emit(EVENT_NAME, eventFrame);

        expect(worked).toBe(1);
    });
})
