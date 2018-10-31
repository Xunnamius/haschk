/** @flow
 * @description DNSCHK popup functionality
 * @name Popup
 */

import './index.css'

import DnschkPort from 'universe/DnschkPort';

declare var chrome:any;

const bridge = new DnschkPort(chrome);

document.getElementById('fetchJudgedDownloadItems').addEventListener('click', (e) => {
    e.preventDefault();
    let downloadList = document.getElementById("downloadItems");
    downloadList.innerHTML = '';
    bridge.emit('fetch', 'judgedDownloadItems').then((res)=>{
        Object.keys(res.judgedDownloadItems).forEach((id) =>
        {
            let item = res.judgedDownloadItems[id];
            let download = document.createElement("li", {
                id: id
            });
            download.innerHTML = `#${id}: ${item.downloadItem.filename} [${
                item.judgement == 'unknown' ? '?' : (item.judgement == 'unsafe' ? 'X' : '✓')
            }]`;
            downloadList.appendChild(download);
        });
    });
});

document.getElementById('unsafe_test').addEventListener('click', () => {
    bridge.emit('.judgement.unsafe', {
        id: Math.random() * 1000 + 1000,
        filename: "fake_unsafe.pdf"
    });
});

document.getElementById('safe_test').addEventListener('click', () => {
    bridge.emit('.judgement.safe', {
        id: Math.random() * 1000 + 1000,
        filename: "fake_safe.pdf"
    });
});

document.getElementById('unknown_test').addEventListener('click', () => {
    bridge.emit('.judgement.unknown', {
        id: Math.random() * 1000 + 1000,
        filename: "fake_unknown.pdf"
    });
});

document.getElementById('clear').addEventListener('click', () => {
    bridge.emit('.ui.clear');
    let downloadList = document.getElementById("downloadItems");
    downloadList.innerHTML = '';
});

