/* @flow */

import { DownloadNewEventFrame } from 'universe/events';

test('::continue(?filename) works as expected', () => {
    const e = new DownloadNewEventFrame();

    expect(e._suggestion).toEqual({});
    e.continue()
    expect(e._suggestion).toEqual({});
    e.continue({ suggestion: 'suggested-filename' });
    expect(e._suggestion).toEqual({ suggestion: 'suggested-filename' });
    e.continue();
    expect(e._suggestion).toEqual({ suggestion: 'suggested-filename' });
    e.continue({ suggestion: 'suggested-filename2' });
    expect(e._suggestion).toEqual({ suggestion: 'suggested-filename2' });
});

test('::finish() works as expected', () => {
    let finalSuggestion = null;
    const e = new DownloadNewEventFrame(suggestion => finalSuggestion = suggestion);

    e.continue({ suggestion: 'suggested-filename' });
    e.finish();
    expect(finalSuggestion).toEqual({ suggestion: 'suggested-filename' });
});
