/** @flow
 * @description DNSCHK popup functionality
 * @name Popup
 */

import './index.css'

import DnschkPort from 'universe/DnschkPort';

declare var chrome:any;

const bridge = new DnschkPort(chrome);

document.getElementById('fetchHandledDownloadItems').addEventListener('click', (e) => {
    e.preventDefault();
    bridge.emit('fetch', 'judgedDownloadItems');
});

bridge.onMessage(console.log);

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
