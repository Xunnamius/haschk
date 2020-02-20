/** @flow
 *  @description These are utility functions and constants for our UI system
 */

import { Debug } from 'universe'
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

export const setDefaultBadgeState = () => setBadge(chrome)(' ', '#D0D6B5');
export const setIncomingBadgeState = () => setBadge(chrome)(' ••• ', '#000000');
export const setErrorBadgeState = () => setBadge(chrome)(' ERR ', '#000000');
export const setSafeBadgeState = () => setBadge(chrome)(' ', '#6EEB83');
export const setUnsafeBadgeState = () => setBadge(chrome)(' ', '#FF3C38');

export const redrawPopupUI = (downloadItems: Object) => {
    // TODO
    Debug.log(chrome, 'redrawUI called: ', downloadItems);
};

export const clearPopupUI = () => {
    // TODO
    Debug.log(chrome, '(clearUI called)');
};
