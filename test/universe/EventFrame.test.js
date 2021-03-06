/* @flow */

import { EventFrame } from 'universe/events'

test('without modifications, name is "<unknown>"', () => {
    const e = new EventFrame();

    expect(e.name).toBe('<unknown>');
});

test('multiple calls to ::continue() pass-through to ::_continueFn', () => {
    let count = 0;
    const e = new EventFrame(() => count++, undefined);

    e.continue();
    e.continue();
    e.continue();

    expect(count).toBe(3);
});

test('::finish() is idempotent; mutates ::finished property', () => {
    let count = 0;
    const e = new EventFrame(undefined, () => count++);

    expect(e.finished).toBe(false);

    e.finish();
    e.finish();
    e.finish();

    expect(count).toBe(1);
    expect(e.finished).toBe(true);
});

test('stop() mutates stopped property', () => {
    const e = new EventFrame();

    expect(e.stopped).toBe(false);

    e.stop();

    expect(e.stopped).toBe(true);
});
