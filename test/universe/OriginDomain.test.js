/* @flow */

import { OriginDomain } from 'universe';

test('::constructor() works as expected', () => {
    const o1 = new OriginDomain();
    const o2 = new OriginDomain('origindomain');

    expect(o1.toString()).toBe('');
    expect(o2.toString()).toBe('origindomain');
});

test('::update() works as expected', () => {
    const o1 = new OriginDomain();

    o1.update('newstring');

    expect(o1.toString()).toBe('newstring');
});

test('instance cannot be cast to number', () => {
    const o1 = new OriginDomain();
    expect(() => +o1).toThrow();
});

test('::extractDomainFromURI() returns proper URI fragment', () => {
    expect(OriginDomain.extractDomainFromURI('https://jestjs.io/docs/en/expect#tothrowerror')).toBe('jestjs.io');
    expect(OriginDomain.extractDomainFromURI('bernarddickens.com')).toBe('bernarddickens.com');
    expect(OriginDomain.extractDomainFromURI('chrome://ngfjkngkjdn-039nngfjks.9gj82jungfkdn/')).toBe('ngfjkngkjdn-039nngfjks.9gj82jungfkdn');
});
