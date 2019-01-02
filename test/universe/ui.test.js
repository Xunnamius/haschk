/* @flow */

import { guaranteeElementById } from 'universe/ui'

test('guaranteeElementById returns HTMLElement', () => {
    const el = {};
    document.getElementById = id => el;
    expect(guaranteeElementById('id')).toBe(el);
});

test("guaranteeElementById throws if it can't return HTMLElement", () => {
    document.getElementById = id => null;
    expect(() => guaranteeElementById('id')).toThrow();
});
