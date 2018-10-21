/* @flow */

import { EventEmitter as EE, EventFrame } from 'universe/events';

const standardTests = oracleFactory => {
    test('::emit(event) calls callback ::addListener(event, callback)', () => {
        const oracle = oracleFactory();
        let worked = false;

        // flow-disable-line
        oracle.addListener('event', () => worked = true);
        oracle.emit('event');

        expect(worked).toBe(true);
    });

    test('::emit(event) returns Promise that resolves properly', async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener('event', async () => await new Promise((resolve) => setTimeout(() => { worked = true; resolve(); }, 500)));
        await oracle.emit('event');

        expect(worked).toBe(true);
    });

    test('::emit(event) callbacks emits error event on exception', async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener('event', () => { throw new Error('exception'); });
        // flow-disable-line
        oracle.addListener('error', () => worked = true);
        await oracle.emit('event');

        expect(worked).toBe(true);
    });

    test('::emit(event) triggers sync and async callbacks', async () => {
        const oracle = oracleFactory();
        let syncWorked = false;
        let asyncWorked = false;

        // flow-disable-line
        oracle.addListener('event', () => syncWorked = true);
        // flow-disable-line
        oracle.addListener('event', async () => asyncWorked = true);
        await oracle.emit('event');

        expect(syncWorked && asyncWorked).toBe(true);
    });

    test('async callbacks execute in sequence (serially, non-blocking)', async () => {
        const oracle = oracleFactory();
        const workload = [];

        oracle.addListener('event', async () => await new Promise((resolve) => setTimeout(() => { workload.push(1); resolve(); }, 1000)));
        oracle.addListener('event', async () => await new Promise((resolve) => setTimeout(() => { workload.push(2); resolve(); }, 750)));
        oracle.addListener('event', async () => await new Promise((resolve) => setTimeout(() => { workload.push(3); resolve(); }, 250)));
        oracle.addListener('event', async () => await new Promise((resolve) => setTimeout(() => { workload.push(5); resolve(); }, 500)));
        oracle.addListener('event', async () => await new Promise((resolve) => setTimeout(() => { workload.push(4); resolve(); }, 0)));

        await oracle.emit('event');

        expect(workload).toEqual([1, 2, 3, 5, 4]);
    });
};

const frameworkTests = oracleFactory => {
    test('::emit(frameworkEvent, eventFrame, true) calls callback ::addListener(frameworkEvent, callback)', () => {
        const oracle = oracleFactory();
        const eventFrame = new EventFrame(() => {}, () => {});
        let worked = false;

        // flow-disable-line
        oracle.addListener('frameworkEvent', (e: EventFrame, bool: boolean) => worked = (e instanceof EventFrame) && bool);
        oracle.emit('frameworkEvent', eventFrame, true);

        expect(worked).toBe(true);
    });

    test('EventFrame::stop() interrupts event loop', () => {
        const oracle = oracleFactory();
        const eventFrame = new EventFrame(() => {}, () => {});
        let worked = false;

        // flow-disable-line
        oracle.addListener('frameworkEvent', () => worked = true);
        oracle.addListener('frameworkEvent', (e: EventFrame) => e.stop());
        // flow-disable-line
        oracle.addListener('frameworkEvent', () => worked = false);
        oracle.emit('frameworkEvent', eventFrame);

        expect(worked).toBe(true);
    });
};

describe('::constructor()', () => {
    standardTests(() => new EE());
});

describe('::constructor(frameworkEvents)', () => {
    const oracleFactory = () => new EE(['frameworkEvent']);
    standardTests(oracleFactory);
    frameworkTests(oracleFactory);
});
