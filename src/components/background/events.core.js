/** @flow
 * @description Most of the complex core DNSCHK logic and functionality is here
 */

import http from 'axios'
import ParsedUrl from 'url-parse'

import {
    bufferToHex,
    GOOGLE_DNS_HTTPS_RI_FN,
////GOOGLE_DNS_HTTPS_RR_FN,
    HASHING_OUTPUT_LENGTH,
    DANGER_THRESHOLD
} from 'universe'

import { DownloadEventFrame } from 'universe/events'

declare var crypto:any;

export default (oracle: any, chrome: any, context: any) => {
    oracle.addListener('download.incoming', async (e, downloadItem) => {
        const eventFrame = new DownloadEventFrame(oracle, context);
        const startTime = (new Date(downloadItem.startTime)).getTime();
        const tabLoadTime = context.timingData[downloadItem.referrer] || startTime;

        // ! This step protects against certain timing attacks (see issue #3)
        if(startTime - tabLoadTime <= DANGER_THRESHOLD)
            await oracle.emit('download.suspiciousOrigin', eventFrame, downloadItem);

        // ? If the event was ended prematurely, assume downloadItem was handled
        // ? elsewhere in the event flow
        if(!eventFrame.stopped)
            eventFrame.finish();
    });

    // ? This is the NAH vs AH core "judgement" logic
    oracle.addListener('download.completed', (e, downloadItem) => {
        if(context.handledDownloadItems.has(downloadItem.id))
            return;

        (async (downloadItem) => {
            let authedHash: ?string;
            let nonauthedHash: ?string;
            let authedHashRaw: ?string;
            let completed = false;

            try {
                // ? Since it's finished downloading, grab the file's data
                const $file = await http.get(`file://${downloadItem.filename}`, { responseType: 'arraybuffer' });

                // ? Hash file data with proper algorithm
                nonauthedHash = bufferToHex(await crypto.subtle.digest('SHA-256', $file.data));

                // ? Determine resource identifier and prepare for DNS request
                const resourcePath = (new ParsedUrl(downloadItem.url, {})).pathname;
                const resourceIdentifier = bufferToHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(resourcePath)));
                const outputLength = parseInt(HASHING_OUTPUT_LENGTH);

                if(!resourceIdentifier || resourceIdentifier.length != outputLength)
                    throw new Error('failed to hash resource identifier');

                const [ riLeft, riRight ] = [
                    resourceIdentifier.slice(0, outputLength / 2),
                    resourceIdentifier.slice(outputLength / 2, outputLength)
                ];

                // ? Make https-based DNS request
                const targetDomain = downloadItem.originDomain.split('.').slice(-2).join('.');
                const $authedHash = await http.get(GOOGLE_DNS_HTTPS_RI_FN(riLeft, riRight, targetDomain));

                authedHashRaw = !$authedHash.data.Answer ? '<no answer>' : $authedHash.data.Answer.slice(-1)[0].data;
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
                    e.judgeUnknown(downloadItem);
                else
                    authedHash !== nonauthedHash ? e.judgeUnsafe(downloadItem) : e.judgeSafe(downloadItem);
            }
        })(downloadItem);
    });

};
