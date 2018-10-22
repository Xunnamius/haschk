/* @flow */

import { InterruptibleEventFrame } from 'universe/events';
import type { FrameworkEventEmitter } from 'universe/events';

let oracle;
let emitted;

beforeEach(() => {
    oracle = (({ emit(emission, item){ emitted = [emission, item]; } }: any): FrameworkEventEmitter);
    emitted = [];
});

test('::shortCircuitEventLoop() functions as intended', async () => {
    let finished = false;
    let continued = false;

    const e = new InterruptibleEventFrame(oracle, () => void (continued = true), () => void (finished = true));

    await e.shortCircuitEventLoop('event', true);
    expect(continued).toBe(false);
    expect(finished).toBe(true);
    expect(emitted).toEqual(['event', true]);
});
