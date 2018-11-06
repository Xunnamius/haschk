/* @flow */

import { extractDomainFromURI, bufferToHex } from 'universe'

test("extractDomainFromURI doesn't work without protocol", () => {
    expect(() => extractDomainFromURI('xunn.io')).toThrow();
});

test('extractDomainFromURI works with http and https', () => {
    expect(extractDomainFromURI('http://xunn.io')).toBe(extractDomainFromURI('https://xunn.io'));
});

test('extractDomainFromURI returns base domain from sub domain', () => {
    expect(extractDomainFromURI('http://return.base.domain.xunn.io')).toBe('xunn.io');
});

test('extractDomainFromURI returns base domain from deep path', () => {
    expect(extractDomainFromURI('https://return.base.domain.xunn.io/paper/4/paper/4.faker?something=5&other&nother=fake#hash-mash.cash')).toBe('xunn.io');
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
