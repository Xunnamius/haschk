/** @flow
 * @description DNSCHK popup functionality
 * @name Popup
 */

import './index.css'

import DnschkPort from 'universe/DnschkPort';

declare var chrome:any;

const bridge = new DnschkPort(chrome);

document.getElementById('unsafe_test').addEventListener('click', () => {
    bridge.emit('.judgement.unsafe', {
        filename: "fake_unsafe.pdf"
    });
});

document.getElementById('safe_test').addEventListener('click', () => {
    bridge.emit('.judgement.safe', {
        filename: "fake_safe.pdf"
    });
});

document.getElementById('unknown_test').addEventListener('click', () => {
    bridge.emit('.judgement.unknown', {
        filename: "fake_unknown.pdf"
    });
});

document.getElementById('clear').addEventListener('click', () => {
    bridge.emit('.ui.clear');
});
