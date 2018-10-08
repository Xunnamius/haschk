/** @flow
 * DNSCHK background functionality
 * @name Background
 */

import http from 'faxios'
import createHash from 'create-hash'
import ParsedUrl from 'url-parse'
import EventEmitter from 'eventemitter3'
import { icons, getIcon } from '../common'

const DNS_TARGET_FQDN_URI = 'bernarddickens.com';

// ? Returns a string HTTPS endpoint URI that will yield the desired resource
// ? identifier hash
const GOOGLE_DNS_HTTPS_RI_FN = (riHashLeft, riHashRight, originDomain) =>
    `https://dns.google.com/resolve?name=${riHashLeft}.${riHashRight}._ri._dnschk.${originDomain}&type=TXT`;

// ? Returns a string HTTPS endpoint URI that will yield the desired resource
// ? range string
const GOOGLE_DNS_HTTPS_RR_FN = (originDomain) =>
    `https://dns.google.com/resolve?name=_rr._dnschk.${originDomain}&type=TXT`;

const { HASHING_ALGORITHM, HASHING_OUTPUT_LENGTH } = process.env;

// ? Emits events that plugin developers should be hooking in to. Feel free to
// ? add more events as they become necessary.
// ?
// ? Events include:
// ?    * origin.resolving      origin domain resolution logic should run now
// ?    * origin.resolved       origin domain has been resolved (or error)
// ?    * download.created      a new download has been observed
// ?    * download.completed    a download has completed
// ?    * error                 a new error event has occurred
const oracle = new EventEmitter();

declare var chrome:any;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.status == 'complete') {
        try {
            oracle.emit('origin.resolving');
        }

        catch(error) {
            oracle.emit('error', error);
        }
    }
});

// ? This event fires with a DownloadItem object when some download-related event changes
chrome.downloads.onChanged.addListener(targetItem => {
    // ? Only trigger the moment a download completes
    if(targetItem?.state?.current == 'complete') {
        // ? We need to ask for the full DownloadItem instance due to security
        chrome.downloads.search({ id: targetItem.id }, async ([ downloadItem ]) => {
            // ? Since it's finished downloading, grab the file's data
            const $file = await http(`file://${downloadItem.filename}`).GET;

            // ? Hash file data with proper algorithm
            const nonauthedHash = createHash(HASHING_ALGORITHM).update($file.data).digest('hex').toString();

            // ? Determine resource identifier and prepare for DNS request
            const resourcePath = (new ParsedUrl(downloadItem.url, {})).pathname;
            const resourceIdentifier = createHash(HASHING_ALGORITHM).update(resourcePath).digest('hex').toString();
            const outputLength = parseInt(HASHING_OUTPUT_LENGTH);

            const [ riLeft, riRight ] = [
                resourceIdentifier.slice(0, outputLength / 2),
                resourceIdentifier.slice(outputLength / 2, outputLength)
            ];

            // ? Make https-based DNS request
            const $authedHash = await http(GOOGLE_DNS_HTTPS_RI_FN(riLeft, riRight, DNS_TARGET_FQDN_URI)).GET;
            const authedHashRaw = $authedHash.data.Answer.slice(-1)[0].data;
            const authedHash = authedHashRaw.replace(/[^0-9a-f]/gi, '');

            // ? Compare DNS result (auth) with hashed local file data (nonauthed)
            if(authedHash.length !== authedHashRaw.length - 2) {
                console.log('judgement: UNKNOWN');
                chrome.browserAction.setIcon({ path: getIcon(icons.neutral) }, () => {});
            }

            else {
                const judgement = authedHash === nonauthedHash;
                console.log('judgement:', judgement ? 'SAFE' : 'UNSAFE');
                if(judgement)
                    chrome.browserAction.setIcon({ path: getIcon(icons.safe) }, () => {});
                else
                    chrome.browserAction.setIcon({ path: getIcon(icons.unsafe) }, () => {});
            }
        });
    }
});
