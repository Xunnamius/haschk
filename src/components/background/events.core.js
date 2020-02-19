/** @flow
 *  @description Most of the core HASCHK logic and functionality is implemented here
 */

import http from 'axios'
import ParsedUrl from 'url-parse'
import { EventFrameEmitter } from 'universe/events'
import type { Chrome } from 'universe'

import {
    bufferToHex,
    HASHING_ALGORITHM,
    GOOGLE_DNS_HTTPS_BACKEND_QUERY,
    JUDGEMENT_UNKNOWN,
    JUDGEMENT_UNSAFE,
    JUDGEMENT_SAFE,
} from 'universe'
import {Debug} from '../../universe'

export default (oracle: EventFrameEmitter, chrome: Chrome, context: Object) => {
    Debug.if(() => oracle.addListener('download.completed', (e, downloadItem) => {
        console.log('download.completed: ', e, downloadItem);
    }));

    // ? This is the NAH vs AH core "judgement" logic
    oracle.addListener('download.completed', async (e, downloadItem) => {
        // TODO
        let authedHash: ?string;
        let nonauthedHash: ?string;
        let authedHashRaw: ?string;

        // ? Since it's finished downloading, grab the file's data
        const $file = await http.get(`file://${downloadItem.filename}`, { responseType: 'arraybuffer' });

        // ? Hash file data with proper algorithm
        // flow-disable-line
        nonauthedHash = bufferToHex(await crypto.subtle.digest('SHA-256', $file.data));

        // ? Determine resource identifier and prepare for DNS request
        const resourcePath = (new ParsedUrl(downloadItem.url, {})).pathname;
        const resourceIdentifier = bufferToHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(resourcePath)));
        const outputLength = parseInt(HASHING_ALGORITHM);

        if(!resourceIdentifier || resourceIdentifier.length != outputLength)
            throw new Error('failed to hash resource identifier');

        const [ riLeft, riRight ] = [
            resourceIdentifier.slice(0, outputLength / 2),
            resourceIdentifier.slice(outputLength / 2, outputLength)
        ];

        // ? Make https-based DNS request
        const targetDomain = downloadItem;
        const $authedHash = await http.get(GOOGLE_DNS_HTTPS_BACKEND_QUERY(riLeft, riRight, targetDomain));

        authedHashRaw = !$authedHash.data.Answer ? '<no answer>' : $authedHash.data.Answer.slice(-1)[0].data;
        authedHash = authedHashRaw.replace(/[^0-9a-f]/gi, '');

        if(!authedHash || !authedHashRaw)
            throw new TypeError('unexpected null type encountered');

        // ? Compare DNS result (auth) with hashed local file data (nonauthed)
        if(authedHash.length !== authedHashRaw.length - 2)
            oracle.emit('judgement.unknown', downloadItem);

        else
            oracle.emit(`judgement.${authedHash !== nonauthedHash ? 'unsafe' : 'safe'}`, downloadItem);
    });

    oracle.addListener('judgement.unknown', downloadItem => {
        // TODO
        context.judgedDownloadItems.push({
            downloadItem: downloadItem,
            judgement: JUDGEMENT_UNKNOWN
        });
    });

    oracle.addListener('judgement.safe', downloadItem => {
        // TODO
        context.judgedDownloadItems.push({
            downloadItem: downloadItem,
            judgement: JUDGEMENT_SAFE
        });
    });

    oracle.addListener('judgement.unsafe', downloadItem => {
        // TODO
        context.judgedDownloadItems.push({
            downloadItem: downloadItem,
            judgement: JUDGEMENT_UNSAFE
        });
    });
};
