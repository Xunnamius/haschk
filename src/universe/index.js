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

export const NODE_ENV = _NODE_ENV;
export const HASHING_ALGORITHM = _HASHING_ALGORITHM;
export const APPLICATION_LABEL = _APPLICATION_LABEL;

// ? Returns a string HTTPS endpoint URI that will yield the desired resource
// ? identifier hash
export const GOOGLE_DNS_HTTPS_RI_FN = (riHashLeft: string, riHashRight: string, originDomain: string) =>
    `https://dns.google.com/resolve?name=${riHashLeft}.${riHashRight}.${APPLICATION_LABEL}.${originDomain}&type=TXT`;

// ? Returns a string HTTPS endpoint URI that will yield the desired resource
// ? range string
export const GOOGLE_DNS_HTTPS_RR_FN = (originDomain: string) =>
    `https://dns.google.com/resolve?name=_rr._haschk.${originDomain}&type=TXT`;

/**
 * Extracts an nLD (sub)domain fragment from a URL
 *
 * @param {String} url
 */
export const extractOriginDomainFromURI = (url: string) => {
    return (new URL(url)).hostname.split('.').slice(-2).join('.');
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
    log(...args: Array<any>) {
        NODE_ENV === 'development' && console.log(...args);
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

/**
 * Accepts an ArrayBuffer instance from the `SubtleCrypto` interface and returns
 * a hex string.
 *
 * @param {ArrayBuffer} buffer
 */
export const bufferToHex = (buffer: ArrayBuffer) => {
    let hexCodes = [];
    let view = new DataView(buffer);

    if(buffer.byteLength % 4 !== 0)
        throw new Error('Buffer byte length must be a multiple of 4');

    for(let i = 0; i < view.byteLength; i += 4) {
        // ? Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
        let value = view.getUint32(i)
        // ? toString(16) will give the hex representation of the number without padding
        let stringValue = value.toString(16)
        // ? We use concatenation and slice for padding
        let padding = '00000000'
        let paddedValue = (padding + stringValue).slice(-padding.length)
        hexCodes.push(paddedValue);
    }

    // ? Join all the hex strings into one
    return hexCodes.join('');
}
