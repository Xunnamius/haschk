/** @flow
 * @description DNSCHK popup functionality
 * @name Popup
 */

import './index.css'

import {
    DnschkPort,
    guaranteeElementById
} from 'universe/ui';

declare var chrome:any;

const bridge = new DnschkPort(chrome);

// TODO @morty on page (popup) load, trigger the fetchJudgedDownloadItems->click event handler
guaranteeElementById('fetchJudgedDownloadItems').addEventListener('click', (e: Event) => {
    e.preventDefault();
    let downloadList = guaranteeElementById('downloadItems');
    downloadList.innerHTML = '';

    bridge.emit('fetch', 'judgedDownloadItems').then((res)=>{
        Object.keys(res.judgedDownloadItems).forEach((id) =>
        {
            let item = res.judgedDownloadItems[id];
            // ! Unlike the other Flow errors, I'm not sure why Flow is throwing a tantrum over this one...
            // flow-disable-line
            let download = document.createElement('li', {
                id: id
            });
            download.innerHTML = `#${id}: ${item.downloadItem.filename} [${
                item.judgement == 'unknown' ? '?' : (item.judgement == 'unsafe' ? 'X' : '✓')
            }]`;
            downloadList.appendChild(download);
        });
    });
});

guaranteeElementById('unsafe_test').addEventListener('click', () => {
    bridge.emit('.judgement.unsafe', {
        id: Math.random() * 1000 + 1000,
        filename: "fake_unsafe.pdf"
    });
});

guaranteeElementById('safe_test').addEventListener('click', () => {
    bridge.emit('.judgement.safe', {
        id: Math.random() * 1000 + 1000,
        filename: "fake_safe.pdf"
    });
});

guaranteeElementById('unknown_test').addEventListener('click', () => {
    bridge.emit('.judgement.unknown', {
        id: Math.random() * 1000 + 1000,
        filename: "fake_unknown.pdf"
    });
});

guaranteeElementById('clear').addEventListener('click', () => {
    bridge.emit('.ui.clear');
    let downloadList = guaranteeElementById("downloadItems");
    downloadList.innerHTML = '';
});

