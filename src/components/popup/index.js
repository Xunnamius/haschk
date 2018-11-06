/** @flow
 * @description DNSCHK popup functionality
 * @name Popup
 */

import './index.css'

import {
    DnschkEventPort,
    guaranteeElementById
} from 'universe/ui';

declare var chrome:any;

const bridge = new DnschkEventPort(chrome);

// TODO: satisfy Flow type checking here by using a null sentinel function
// TODO: (i.e. check for null and emit error event if failed). When Flow fixes
// TODO: optional chaining, then these can all be changed to `?.` instead of `.`
// TODO: and the problem will be solved gracefully!

// TODO: on page (popup) load, you should trigger the fetchJudgedDownloadItems->click event handler
const appendDownloadToDownloadList = (downloadItem, judgement) => {
    let downloadList = document.getElementById("downloadItems");
    let elem = document.createElement('li', {
        id: downloadItem.id
    });
    elem.innerHTML = `#${downloadItem.id}: ${downloadItem.filename} [${
        judgement == 'unknown' ? '?' : (judgement == 'unsafe' ? 'X' : '✓')
        }]`;
    downloadList.appendChild(elem);
};

window.onload = async () => {
    await bridge.emit('fetch', 'judgedDownloadItems').then((res) => {
        res.judgedDownloadItems.forEach((download) => {
            appendDownloadToDownloadList(download.downloadItem, download.judgement);
        });
    });
};

bridge.on('judgement.unsafe', (downloadItem) => {
    appendDownloadToDownloadList(downloadItem, 'unsafe');
});

bridge.on('judgement.safe', (downloadItem) => {
    appendDownloadToDownloadList(downloadItem, 'safe');
});

bridge.on('judgement.unknown', (downloadItem) => {
    appendDownloadToDownloadList(downloadItem, 'unknown');
});

// * Demoing tools

document.getElementById('fetchJudgedDownloadItems').addEventListener('click', (e) => {
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
        id: Math.floor(Math.random() * 1000 + 1000),
        filename: "fake_unsafe.pdf"
    });
});

guaranteeElementById('safe_test').addEventListener('click', () => {
    bridge.emit('.judgement.safe', {
        id: Math.floor(Math.random() * 1000 + 1000),
        filename: "fake_safe.pdf"
    });
});

guaranteeElementById('unknown_test').addEventListener('click', () => {
    bridge.emit('.judgement.unknown', {
        id: Math.floor(Math.random() * 1000 + 1000),
        filename: "fake_unknown.pdf"
    });
});

guaranteeElementById('clear').addEventListener('click', () => {
    bridge.emit('.ui.clear');
    let downloadList = guaranteeElementById("downloadItems");
    downloadList.innerHTML = '';
});
