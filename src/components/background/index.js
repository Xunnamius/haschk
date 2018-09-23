/* import './img/icon-128.png'
import './img/icon-34.png' */

import http from 'faxios'

const DNS_TARGET_FQDN_URI = 'bernarddickens.com';
const GOOGLE_DNS_TARGET_URI = (resourceHash1, resourceHash2, targetDomain) =>
    `https://dns.google.com/resolve?name=${resourceHash1}.${resourceHash2}._dnschk.${targetDomain}&type=TXT`;

chrome.downloads.onCreated.addListener(item => console.log('downloads.onCreated listener called!', item));


