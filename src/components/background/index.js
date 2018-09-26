/** @flow
 * DNSCHK background functionality
 * @name Background
 */

import http from 'faxios'
import createHash from 'create-hash'
import ParsedUrl from 'url-parse'

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

declare var chrome:any;

// ? This event fires with the DownloadItem object when a download begins
// chrome.downloads.onCreated.addListener(downloadItem => console.log('downloads.onCreated listener called!', downloadItem));

// ? This event fires with a DownloadItem object when some download-related event changes
chrome.downloads.onChanged.addListener(targetItem => {
    // ? Only trigger the moment a download completes
    if(targetItem?.state?.current == 'complete')
    {
        // ? We need to ask for the full DownloadItem instance due to security
        chrome.downloads.search({ id: targetItem.id }, async ([ downloadItem ]) => {
            // ? Since it's finished downloading, grab the file's data
            const $file = await http(`file://${downloadItem.filename}`).GET;

            // ? Hash file data with proper algorithm
            const nonauthedHash = createHash(HASHING_ALGORITHM).update($file.data).digest('hex').toString();

            // ? Determine resource identifier and prepare for DNS request
            const resourcePath = (new ParsedUrl(downloadItem.url, {})).pathname;
            const resourceIdentifier = createHash(HASHING_ALGORITHM).update(resourcePath).digest('hex').toString();

            const [ riLeft, riRight ] = [
                resourceIdentifier.slice(0, HASHING_OUTPUT_LENGTH / 2),
                resourceIdentifier.slice(HASHING_OUTPUT_LENGTH / 2, HASHING_OUTPUT_LENGTH)
            ];

            // ? Make https-based DNS request
            const $authedHash = await http(GOOGLE_DNS_HTTPS_RI_FN(riLeft, riRight, DNS_TARGET_FQDN_URI)).GET;
            const authedHashRaw = $authedHash.data.Answer.slice(-1)[0].data;
            const authedHash = authedHashRaw.replace(/[^0-9a-f]/gi, '');

            // ? Compare DNS result (auth) with hashed local file data (nonauthed)
            if(authedHash.length !== authedHashRaw.length - 2)
                console.log('judgement: RESOURCE IDENTIFIER NOT FOUND');

            else {
                console.log('judgement:', authedHash === nonauthedHash ? 'SAFE' : 'UNSAFE');
            }
        });
    }
});
