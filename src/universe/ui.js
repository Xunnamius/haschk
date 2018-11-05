/* @flow */

import DnschkPort from './DnschkPort'

declare var chrome:any;

export const setBadge = (chrome: chrome) => {
    return (_text: string, _color: string = '#FFF888') => {
        chrome.browserAction.setBadgeBackgroundColor({
            color: _color
        });
        chrome.browserAction.setBadgeText({
            text: _text
        });
    };
};

export const guaranteeElementById = (id: string): HTMLElement => {
    const el = document.getElementById(id);
    if(!el) throw new TypeError('getElementById did not return an element as expected');
    return el;
};

export {
    DnschkPort
};
