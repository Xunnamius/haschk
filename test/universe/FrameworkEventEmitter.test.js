/* @flow */

import { EventEmitter as EE } from 'universe/events';
import type { EventFrame } from 'universe/events';

const standardTests = (oracleFactory, eventName) => {
    test(`::emit(${eventName}) calls callback ::addListener(${eventName}, callback)`, () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(eventName, () => void (worked = true));
        oracle.emit(eventName);

        expect(worked).toBe(true);
    });

    test(`::emit(${eventName}) returns Promise that resolves properly`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(eventName, async () => await new Promise((resolve) => setTimeout(() => { worked = true; resolve(); }, 10)));
        await oracle.emit(eventName);

        expect(worked).toBe(true);
    });

    test(`::emit(${eventName}) callbacks emits error event on throw`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(eventName, () => { throw new Error('exception'); });
        oracle.addListener('error', () => void (worked = true));
        await oracle.emit(eventName);

        expect(worked).toBe(true);
    });

    test(`::emit(${eventName}) triggers sync and async callbacks`, async () => {
        const oracle = oracleFactory();
        let syncWorked = false;
        let asyncWorked = false;

        oracle.addListener(eventName, () => void (syncWorked = true));
        oracle.addListener(eventName, async () => void (asyncWorked = true));
        await oracle.emit(eventName);

        expect(syncWorked && asyncWorked).toBe(true);
    });

    test(`::addListener(${eventName}, callback) works with synchronous callbacks that return a Promise`, async () => {
        const oracle = oracleFactory();
        let worked = false;

        oracle.addListener(eventName, () => new Promise((resolve) => setTimeout(() => { worked = true; resolve(); }, 500)));
        await oracle.emit(eventName);

        expect(worked).toBe(true);
    });

    test(`async callbacks execute in sequence (serially, non-blocking)`, async () => {
        const oracle = oracleFactory();
        const workload = [];

        oracle.addListener(eventName, async () => new Promise((resolve) => setTimeout(() => { workload.push(1); resolve(); }, 75)));
        oracle.addListener(eventName, async () => new Promise((resolve) => setTimeout(() => { workload.push(2); resolve(); }, 50)));
        oracle.addListener(eventName, async () => new Promise((resolve) => setTimeout(() => { workload.push(3); resolve(); }, 35)));
        oracle.addListener(eventName, async () => new Promise((resolve) => setTimeout(() => { workload.push(5); resolve(); }, 100)));
        oracle.addListener(eventName, async () => new Promise((resolve) => setTimeout(() => { workload.push(4); resolve(); }, 0)));

        await oracle.emit(eventName);

        expect(workload).toEqual([1, 2, 3, 5, 4]);
    });

    test(`::prependListener(${eventName}, callback) works as expected`, async () => {
        const oracle = oracleFactory();
        const workload = [];

        oracle.prependListener(eventName, async () => new Promise((resolve) => setTimeout(() => { workload.push(2); resolve(); }, 75)));
        oracle.appendListener(eventName, async () => new Promise((resolve) => setTimeout(() => { workload.push(3); resolve(); }, 50)));
        oracle.prependListener(eventName, async () => new Promise((resolve) => setTimeout(() => { workload.push(1); resolve(); }, 100)));

        await oracle.emit(eventName);

        expect(workload).toEqual([1, 2, 3]);
    });
};

const frameworkTests = (oracleFactory, eventName) => {
    test(`::emit(${eventName}, eventFrame, true) calls callback ::addListener(${eventName}, callback)`, () => {
        const oracle = oracleFactory();
        const eventFrame = { stopped: false };
        let worked = false;

        oracle.addListener(eventName, (e: EventFrame, bool: boolean) => {
            expect(e.stopped).toBe(false);
            expect(bool).toBe(true);
            worked = true;
        });

        oracle.emit(eventName, eventFrame, true);

        expect(worked).toBe(true);
    });

    test(`EventFrame::stop() interrupts event loop`, () => {
        const oracle = oracleFactory();
        const eventFrame = { stopped: false };
        let worked = false;

        oracle.addListener(eventName, () => void (worked = true));
        oracle.addListener(eventName, (e: EventFrame) => e.stop());
        oracle.addListener(eventName, () => void (worked = false));
        oracle.emit(eventName, eventFrame);

        expect(worked).toBe(true);
    });

    test(`attempting to emit a framework event without passing an EventFrame (or compat) as first argument throws`, async () => {
        const oracle = oracleFactory();
        const eventFrame = {};
        let worked = true;

        oracle.addListener(eventName, () => void (worked = false));
        oracle.addListener('error', err => expect(!!err).toBe(true));
        await oracle.emit(eventName, eventFrame);

        expect(worked).toBe(true);
    });

    test(`attempting to emit a framework event and passing an EventFrame compat as first argument works`, async () => {
        const oracle = oracleFactory();
        const eventFrame = { stopped: false };
        let worked = false;

        oracle.addListener(eventName, (e: EventFrame) => void (worked = e.stopped === false));
        oracle.addListener('error', () => void (worked = false));
        await oracle.emit(eventName, eventFrame);

        expect(worked).toBe(true);
    });
};

const factory = () => new EE(['frameworkEvent']);
standardTests(factory, 'event');
frameworkTests(factory, 'frameworkEvent');
