/* @flow */

import {
    bufferToHex,
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

test('bufferToHex translate buffer to hex as expected', () => {
    const data = new ArrayBuffer(4);
    const dataview = new DataView(data);

    dataview.setUint8(0, 15);
    dataview.setUint8(1, 34);
    dataview.setUint8(2, 56);
    dataview.setUint8(3, 79);
    expect(bufferToHex(data)).toBe('0f22384f');
});

test('bufferToHex translate buffer to hex if all zeros', () => {
    const data = new ArrayBuffer(8);
    expect(bufferToHex(data)).toBe('0000000000000000');
});

test('bufferToHex throws if ArrayBuffer is of non-conformant byte length', () => {
    const data = new ArrayBuffer(7);
    expect(() => bufferToHex(data)).toThrow();
});
