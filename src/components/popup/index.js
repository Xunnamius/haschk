/** @flow
 * @description DNSCHK popup functionality
 * @name Popup
 */

import './index.css'

import {
    DnschkEventPort,
    guaranteeElementById
} from 'universe/ui';

import {
    JUDGEMENT_UNKNOWN,
    JUDGEMENT_UNSAFE,
    JUDGEMENT_SAFE
} from 'universe';

declare var chrome:any;

const bridge = new DnschkEventPort(chrome);
const downloadList = guaranteeElementById('downloadItems');

// TODO: ensure bugs are fixed and UI meets specification outlined at
// TODO: https://github.com/morty-c137-prime/DNSCHK/issues/31

const appendDownloadToDownloadList = (downloadItem: any, judgement: string) => {
    // flow-disable-line
    let elem: HTMLElement = document.createElement('li');
    elem.setAttribute('id', downloadItem.id);
    elem.innerHTML = `#${downloadItem.id}: ${downloadItem.filename} <span class=${judgement}>[${
        judgement == JUDGEMENT_UNKNOWN ? '?' : (judgement == JUDGEMENT_UNSAFE ? 'X' : '✓')
    }]</span>`;
    downloadList.insertBefore(elem, downloadList.childNodes[0]);
};

window.onload = async () => {
    await bridge.emit('contextFetch', 'judgedDownloadItems').then((res) => {
        res.judgedDownloadItems.forEach((download) => {
            appendDownloadToDownloadList(download.downloadItem, download.judgement);
        });
    });
};

bridge.on('judgement.unsafe', (downloadItem) => {
    appendDownloadToDownloadList(downloadItem, JUDGEMENT_UNSAFE);
});

bridge.on('judgement.safe', (downloadItem) => {
    appendDownloadToDownloadList(downloadItem, JUDGEMENT_SAFE);
});

bridge.on('judgement.unknown', (downloadItem) => {
    appendDownloadToDownloadList(downloadItem, JUDGEMENT_UNKNOWN);
});

// ??
// ?? Demo/development UI components
// ??

// guaranteeElementById('fetchJudgedDownloadItems').addEventListener('click', (e: MouseEvent) => {
//     e.preventDefault();
//     downloadList.innerHTML = '';

//     bridge.emit('fetch', 'judgedDownloadItems').then((res)=>{
//         Object.keys(res.judgedDownloadItems).forEach((id) =>
//         {
//             let item = res.judgedDownloadItems[id];
//             // flow-disable-line
//             let download = document.createElement('li');
//             download.setAttribute('id', item.downloadItem.id);
//             download.innerHTML = `#${item.downloadItem.id}: ${item.downloadItem.filename} [${
//                 item.judgement == 'unknown' ? '?' : (item.judgement == 'unsafe' ? 'X' : '✓')
//             }]`;
//             downloadList.appendChild(download);
//         });
//     });
// });

// guaranteeElementById('unsafe_test').addEventListener('click', () => {
//     bridge.emit('.judgement.unsafe', {
//         id: Math.floor(Math.random() * 1000 + 1000),
//         filename: "fake_unsafe.pdf"
//     });
// });

// guaranteeElementById('safe_test').addEventListener('click', () => {
//     bridge.emit('.judgement.safe', {
//         id: Math.floor(Math.random() * 1000 + 1000),
//         filename: "fake_safe.pdf"
//     });
// });

// guaranteeElementById('unknown_test').addEventListener('click', () => {
//     bridge.emit('.judgement.unknown', {
//         id: Math.floor(Math.random() * 1000 + 1000),
//         filename: "fake_unknown.pdf"
//     });
// });

guaranteeElementById('clear').addEventListener('click', () => {
    bridge.emit('.ui.clear');
    downloadList.innerHTML = '';
});
