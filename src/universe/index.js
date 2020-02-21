/** @flow
 *  @description These are our globally useful utility functions and constants
 */

export const JUDGEMENT_SAFE = 'safe';
export const JUDGEMENT_UNSAFE = 'unsafe';
export const JUDGEMENT_UNKNOWN = 'unknown';
export const JUDGEMENT_UNDECIDED = 'undecided';

declare var chrome: any;
export type Chrome = chrome;

declare var _NODE_ENV: string;
declare var _HASHING_ALGORITHM: string;
declare var _APPLICATION_LABEL: string;
declare var _MAX_REQUEST_HISTORY: string;
declare var _BASE32_URN_LENGTH: string;
declare var _URN_PREFIX: string;

export const NODE_ENV = _NODE_ENV;
export const URN_PREFIX = _URN_PREFIX;
export const HASHING_ALGORITHM = _HASHING_ALGORITHM;
export const APPLICATION_LABEL = _APPLICATION_LABEL;
export const MAX_REQUEST_HISTORY = parseInt(_MAX_REQUEST_HISTORY);
export const BASE32_URN_LENGTH = parseInt(_BASE32_URN_LENGTH);

// ? Returns a string HTTPS endpoint URI used to query the backend for URNs. See
// ? the paper for details on what C1, C2, and BD are.
export const GOOGLE_DNS_HTTPS_BACKEND_QUERY = (C1: string, C2: string, BD: string) =>
    `https://dns.google.com/resolve?name=${C1}.${C2}.${APPLICATION_LABEL}.${BD}&type=TXT`;

// ? Returns a string HTTPS endpoint URI used to query if the backend exists.
// ? See the paper for details on what BD is.
export const GOOGLE_DNS_HTTPS_BACKEND_EXISTS = (BD: string) =>
    `https://dns.google.com/resolve?name=${APPLICATION_LABEL}.${BD}&type=TXT`;

/**
 * Extracts the 3LD and 2LD subdomain fragments (in that order) from a valid
 * URI, returning them in an array [3LD, 2LD]. If there is no 3LD, then only the
 * 2LD is returned in an array [2LD].
 *
 * @param {String} uri
 * @returns {Array} An array of Backend Domain (BD) candidates
 */
export const extractBDCandidatesFromURI = (uri: string) => {
    const host = (new URL(uri)).hostname.split('.');
    const candidates = [host.slice(-3).join('.')];
    host.length > 2 && candidates.push(host.slice(-2).join('.'))

    return candidates;
};

/**
 * Extracts the actual DNS response from the Google DoH API response object.
 *
 * @param {*} response The DoH answer string or NULL if there was no answer
 */
export const extractAnswerDataFromResponse = (response: any) => {
    return !response.data.Answer
        ? null
        : response.data.Answer.slice(-1)[0].data.replace(/[^0-9a-z]/gi, '').toLowerCase();
};

/**
 * A set of cheap debugging tools that are automatically disabled if NODE_ENV is
 * not `development`!
 */
export const Debug = {
    /**
     * A replacement for `console.log` that will be silenced if not deving
     *
     * @param  {*} [args]
     */
    log(chrome: Chrome, ...args: Array<any>) {
        NODE_ENV === 'development' && chrome.extension.getBackgroundPage().console.log(...args);
    },

    /**
     * Accepts a function that is only called if we're deving
     *
     * @param {Function} fn
     */
    if(fn: Function) {
        NODE_ENV === 'development' && fn();
    }
};
