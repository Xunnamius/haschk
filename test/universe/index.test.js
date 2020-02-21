/* @flow */

import {
    extractBDCandidatesFromURI,
} from 'universe'

test("extractBDCandidatesFromURI doesn't work on URIs without a protocol", () => {
    expect(() => extractBDCandidatesFromURI('xunn.io')).toThrow();
});

test('extractBDCandidatesFromURI works with http and https URIs', () => {
    expect(extractBDCandidatesFromURI('http://xunn.io')).toEqual(extractBDCandidatesFromURI('https://xunn.io'));
});

test('extractBDCandidatesFromURI returns 3LD and 2LD from URI', () => {
    expect(extractBDCandidatesFromURI('http://return.base.domain.xunn.io')).toEqual(['domain.xunn.io', 'xunn.io']);
});

test('extractBDCandidatesFromURI returns 3LD and 2LD URI with a deep path', () => {
    expect(extractBDCandidatesFromURI('https://return.base.domain.xunn.io/paper/4/paper/4.faker?something=5&other&nother=fake#hash-mash.cash'))
        .toEqual(['domain.xunn.io', 'xunn.io']);
});
