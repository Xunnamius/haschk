/** @flow
 * @description Most of the complex core DNSCHK logic and functionality is here
 */

import http from 'faxios'
import createHash from 'create-hash'
import ParsedUrl from 'url-parse'

import {
    extractDomainFromURI,
    DNS_TARGET_FQDN_URI,
    GOOGLE_DNS_HTTPS_RI_FN,
////GOOGLE_DNS_HTTPS_RR_FN,
    HASHING_ALGORITHM,
    HASHING_OUTPUT_LENGTH
} from 'universe'

// TODO: add new core events

import { DownloadCrossOriginEventFrame } from 'universe/events'

export default (oracle: any, chrome: any, context: any) => {
    oracle.addListener('download.incoming', async (dnschk, downloadItem) => {
        // TODO: can't call finish twice! is dnschk.continue supposed to be passed in here?
        const eventFrame = new DownloadCrossOriginEventFrame(oracle, context);

        if(downloadItem.originDomain != downloadItem.urlDomain)
            await oracle.emit('download.crossOrigin', eventFrame, downloadItem);

        // ? If the event was ended prematurely, assume downloadItem was handled
        // ? elsewhere in the event flow
        if(!eventFrame.stopped)
            eventFrame.finish();
    });

    oracle.addListener('origin.resolving', (tab, originDomainInstance) => {
        originDomainInstance.update(extractDomainFromURI(tab.url));
    });

    oracle.addListener('origin.resolved', (tab, originDomain) => {
        chrome.storage.local.get('tabMeta', map => {
            map = chrome.runtime.lastError ? {} : map;
            // TODO: plug this into the content script w/ message passing
            map[tab.id] = originDomain;
            chrome.storage.local.set({ 'di=>od': map });
        });
    });

    // ? This is the NAH vs AH core "judgement" logic
    oracle.addListener('download.completed', downloadItem => {
        if(context.handledDownloadItems.has(downloadItem.id))
            return;

        (async (downloadItem) => {
            let authedHash: ?string;
            let nonauthedHash: ?string;
            let authedHashRaw: ?string;
            let completed = false;

            try {
                // ? Since it's finished downloading, grab the file's data
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
                if(!authedHash || !authedHashRaw)
                    throw new TypeError('unexpected null type encountered');

                // ? Compare DNS result (auth) with hashed local file data (nonauthed)
                if(authedHash.length !== authedHashRaw.length - 2)
                    oracle.emit('judgement.unknown', downloadItem);
                else
                    oracle.emit(`judgement.${ authedHash !== nonauthedHash ? 'un' : '' }safe`, downloadItem);
            }
        })(downloadItem);
    });
};
