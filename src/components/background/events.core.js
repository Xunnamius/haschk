/** @flow
 *  @description Most of the core HASCHK logic and functionality is implemented here
 */

import http from 'axios'
import base32Encode from 'base32-encode'
import { EventFrameEmitter } from 'universe/events'

import {
    Debug,
    URN_PREFIX,
    HASHING_ALGORITHM,
    GOOGLE_DNS_HTTPS_BACKEND_QUERY,
    extractAnswerDataFromResponse,
    JUDGEMENT_UNKNOWN,
    JUDGEMENT_UNSAFE,
    JUDGEMENT_SAFE,
    BASE32_URN_LENGTH,
} from 'universe'

import {
    setDefaultBadgeState,
    setIncomingBadgeState,
    setErrorBadgeState,
    setSafeBadgeState,
    setUnsafeBadgeState,
} from 'universe/ui'

import type { Chrome } from 'universe'
import type { EventFrame } from 'universe/events'

declare var crypto;

export default (oracle: EventFrameEmitter, chrome: Chrome, context: Object) => {
    // ? This event fires whenever haschk decides a download is NOT safe
    oracle.addListener(`judgement.${JUDGEMENT_UNSAFE}`, (e: EventFrame, downloadItem) => {
        chrome.downloads.removeFile(downloadItem.id, () => {
            if(chrome.runtime.lastError)
                oracle.emit('error', chrome.runtime.lastError.message);
        });
    });

    // ? This event sets the default badge state on startup
    oracle.addListener('startup', () => setDefaultBadgeState());

    // ? This event responds to any requests for the list of known download
    // ? items (i.e. from another component of the extension)
    oracle.addListener('request.updateDownloadItems', () => {
        oracle.emit('response.updateDownloadItems', context.downloadItems);
    });

    // ? These events update the badge state upon certain events happening

    oracle.addListener('error', () => setErrorBadgeState());
    oracle.addListener('download.incoming', () => setIncomingBadgeState());
    oracle.addListener('download.paused', () => setDefaultBadgeState());
    oracle.addListener('download.resumed', () => setIncomingBadgeState());
    oracle.addListener('download.interrupted', () => setDefaultBadgeState());
    oracle.addListener(`judgement.${JUDGEMENT_UNKNOWN}`, () => setDefaultBadgeState());
    oracle.addListener(`judgement.${JUDGEMENT_SAFE}`, () => setSafeBadgeState());
    oracle.addListener(`judgement.${JUDGEMENT_UNSAFE}`, () => setUnsafeBadgeState());

    // ? This event is the heart of the extension where we implement the HASCHK
    // ? protocol
    oracle.addListener('download.completed', async (e: EventFrame, downloadItem) => {
        if(downloadItem.judgement === JUDGEMENT_UNKNOWN) {
            oracle.emit(`judgement.${JUDGEMENT_UNKNOWN}`, downloadItem);
            return;
        }

        const hasFilesystemAccess = await new Promise(res => chrome.extension.isAllowedFileSchemeAccess(t => res(t)));

        if(!hasFilesystemAccess)
            throw new Error(`HASCHK needs file scheme access to operate. Please allow access to file URLs in settings`);

        // ? Since it's finished downloading, grab the file's data, but we need
        // ? to use custom XHR because fetch (and Axios) can't handle status
        // ? code 0 (pathetic)
        const fetchLocal = async url => {
            return new Promise(function(resolve, reject) {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = () => reject(new Error('file://XMLHttpRequest request failed'));
                xhr.responseType = 'arraybuffer';
                xhr.open('GET', url);
                xhr.send(null);
            });
        };

        const fileData = await fetchLocal(`file://${downloadItem.filename}`);

        // ? Hash file data with proper algorithm
        const base32FileHash = base32Encode(await crypto.subtle.digest(HASHING_ALGORITHM, fileData), 'Crockford', {
            padding: false
        });

        // ? Construct BASE32 encoded URN and slice it up to yield C1 and C2
        const base32Urn = base32Encode((new TextEncoder()).encode(`${URN_PREFIX}${base32FileHash}`), 'Crockford', {
            padding: true
        });

        if(base32Urn.length !== BASE32_URN_LENGTH)
            throw new Error(`URN length is not ${BASE32_URN_LENGTH}, got ${base32Urn.length} instead`);

        const [ C1, C2 ] = [
            base32Urn.slice(0, base32Urn.length / 2),
            base32Urn.slice(base32Urn.length / 2, base32Urn.length),
        ];

        // ? Make https-based DNS request
        const queryUri = GOOGLE_DNS_HTTPS_BACKEND_QUERY(C1, C2, downloadItem.backendDomain);
        const data = extractAnswerDataFromResponse(await http.get(queryUri));

        Debug.log(chrome, `C1: ${C1}`);
        Debug.log(chrome, `C2: ${C2}`);
        Debug.log(chrome, `backend domain: ${downloadItem.backendDomain}`);
        Debug.log(chrome, `query response data: ${data || 'null'}`);

        // ? Compare DNS result with expected
        oracle.emit(`judgement.${data === 'ok' ? JUDGEMENT_SAFE : JUDGEMENT_UNSAFE}`, downloadItem);
    });
};
