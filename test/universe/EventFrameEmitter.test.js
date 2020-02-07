/* @flow */

import { EventFrameEmitter as EE } from 'universe/events';
import type { EventFrame } from 'universe/events';

const oracleFactory = () => new EE();
const eventName = 'testEvent';

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
