/* @flow */

import { guaranteeElementById } from 'universe/ui'

test('guaranteeElementById returns HTMLElement', () => {
    const el = {};
    // flow-disable-line
    document.getElementById = () => el;
    expect(guaranteeElementById('id')).toBe(el);
});

test("guaranteeElementById throws if it can't return HTMLElement", () => {
    // flow-disable-line
    document.getElementById = () => null;
    expect(() => guaranteeElementById('id')).toThrow();
});
