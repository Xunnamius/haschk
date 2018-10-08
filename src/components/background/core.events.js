/** @flow
 * @description Most of the complex core DNSCHK logic and functionality is here
 */

import http from 'faxios'
import createHash from 'create-hash'
import ParsedUrl from 'url-parse'

import {
    DNS_TARGET_FQDN_URI,
    GOOGLE_DNS_HTTPS_RI_FN,
    GOOGLE_DNS_HTTPS_RR_FN,
    HASHING_ALGORITHM,
    HASHING_OUTPUT_LENGTH
} from 'dnschk-utils'

export default (oracle, chrome) => {
    // ? This is the NAH vs AH core "judgement" logic
    oracle.addListener('download.completed', dlItemActual => {
        (async (downloadItem) => {
            let authedHash, nonauthedHash, authedHashRaw;
            let completed = false;

            try {
                // ? Since it's finished downloading, grab the file's data
                // TODO: is this the source of issue
                // TODO: https://github.com/morty-c137-prime/DNSCHK/issues/22
                const $file = await http(`file://${downloadItem.filename}`).GET;

                // ? Hash file data with proper algorithm
                nonauthedHash = createHash(HASHING_ALGORITHM).update($file.data).digest('hex').toString();

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
                authedHashRaw = $authedHash.data.Answer.slice(-1)[0].data;
                authedHash = authedHashRaw.replace(/[^0-9a-f]/gi, '');

                completed = true;
            }

            catch(error) {
                oracle.emit('error', error);
            }

            // ! We want to make sure we don't catch any errors from oracle.emit
            if(completed) {
                // ? Compare DNS result (auth) with hashed local file data (nonauthed)
                if(authedHash.length !== authedHashRaw.length - 2)
                    oracle.emit('judgement.unknown', downloadItem);
                else
                    oracle.emit(`judgement.${ authedHash !== nonauthedHash ? 'un' : '' }safe`, downloadItem);
            }
        })(dlItemActual);
    });

    oracle.addListener('origin.resolving', (tab, originDomainInstance) => {
        originDomainInstance.update(RegExp(/^.*?:\/\/+(.+?)(\/.*)?$/g).exec(tab.url)[1]);
    });

    oracle.addListener('origin.resolved', (tab, originDomain) => {
        chrome.storage.local.get('di=>od', map => {
            map = chrome.runtime.lastError ? {} : map;
            // TODO: this needs a content script to read the urls on the page and generate this mapping
            map[tab.id] = originDomain;
            chrome.storage.local.set({ 'di=>od': map });
        });
    });
};
