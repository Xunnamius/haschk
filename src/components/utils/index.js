/** @flow
 * @description global utility functions and constants
 */

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

class OriginDomain {
    _originDomain: string = '';

    constructor(originDomain: string = '') {
        this._originDomain = originDomain;
    }

    update(newOriginDomain: string) {
        this._originDomain = newOriginDomain;
    }

    toString() {
        return this._originDomain;
    }

    [Symbol.toPrimitive](hint) {
        if(hint == 'number')
            throw new TypeError('OriginDomain instance cannot be coerced into a number!');

        return this.toString();
    }

    get [Symbol.toStringTag]() {
        return 'OriginDomain';
    }
}

export {
    OriginDomain,
    DNS_TARGET_FQDN_URI,
    GOOGLE_DNS_HTTPS_RI_FN,
    GOOGLE_DNS_HTTPS_RR_FN,
    HASHING_ALGORITHM,
    HASHING_OUTPUT_LENGTH
};
