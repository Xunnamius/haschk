/** @flow
 *  @description These are utility functions and constants for our UI system
 */

import type { Chrome } from 'universe'

declare var chrome:any;

/**
 * Changes the text and color of the extension's badge icon
 *
 * @param {Chrome} chrome
 */
export const setBadge = (chrome: Chrome) => {
    return (_text: string, _color: string = '#FFF888') => {
        chrome.browserAction.setBadgeBackgroundColor({
            color: _color
        });

        chrome.browserAction.setBadgeText({
            text: _text
        });
    };
};

/**
 * A `getElementById` implementation guaranteed to return a DOM element or fail.
 *
 * @param {String} id
 */
export const guaranteeElementById = (id: string): HTMLElement => {
    const el = document.getElementById(id);

    if(!el)
        throw new TypeError('getElementById did not return an element as expected');

    return el;
};
