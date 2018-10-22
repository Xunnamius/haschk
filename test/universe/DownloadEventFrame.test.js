/* @flow */

import { DownloadEventFrame } from 'universe/events';

let oracle;
let context;
let emitted;

beforeEach(() => {
    oracle = { emit(emission, item){ emitted = [emission, item]; } };
    context = { handledDownloadItems: new Set };
    emitted = [];
});

test('::judgeSafe() triggers emission of `judgement.safe` event', async () => {
    let finished = false;
    const e = new DownloadEventFrame(oracle, context, () => void (finished = true));
    const dli = { downloadItem: true };

    await e.judgeSafe(dli);
    expect(finished).toBe(true);
    expect(emitted).toEqual(['judgement.safe', dli]);
});

test('::judgeUnsafe() triggers emission of `judgement.unsafe` event', async () => {
    let finished = false;
    const e = new DownloadEventFrame(oracle, context, () => void (finished = true));
    const dli = { downloadItem: true };

    await e.judgeUnsafe(dli);
    expect(finished).toBe(true);
    expect(emitted).toEqual(['judgement.unsafe', dli]);
});

test('::judgeUnknown() triggers emission of `judgement.unknown` event', async () => {
    let finished = false;
    const e = new DownloadEventFrame(oracle, context, () => void (finished = true));
    const dli = { downloadItem: true };

    await e.judgeUnknown(dli);
    expect(finished).toBe(true);
    expect(emitted).toEqual(['judgement.unknown', dli]);
});
