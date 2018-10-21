/* @flow */

import { DownloadCrossOriginEventFrame } from 'universe/events';

let oracle;
let context;
let emitted;

beforeEach(() => {
    oracle = { emit(emission){ emitted = emission; } };
    context = { handledDownloadItems: new Set };
    emitted = false;
});

test('::judgeSafe() triggers emission of `judgement.safe` event', async () => {
    let finished = false;
    const e = new DownloadCrossOriginEventFrame(oracle, context, () => finished = true);

    await e.judgeSafe({ downloadItem: true });
    expect(finished).toBe(true);
    expect(emitted).toBe('judgement.safe');
});

test('::judgeUnsafe() triggers emission of `judgement.unsafe` event', async () => {
    let finished = false;
    const e = new DownloadCrossOriginEventFrame(oracle, context, () => finished = true);

    await e.judgeUnsafe({ downloadItem: true });
    expect(finished).toBe(true);
    expect(emitted).toBe('judgement.unsafe');
});

test('::judgeUnknown() triggers emission of `judgement.unknown` event', async () => {
    let finished = false;
    const e = new DownloadCrossOriginEventFrame(oracle, context, () => finished = true);

    await e.judgeUnknown({ downloadItem: true });
    expect(finished).toBe(true);
    expect(emitted).toBe('judgement.unknown');
});
