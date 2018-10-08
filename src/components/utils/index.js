/** @flow
 * @description global utility functions and constants
 */

import OriginDomain from './OriginDomain'

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

// TODO: Make this modular
export const icons =
{
    neutral: 'neutral',
    safe: 'safe',
    unsafe: 'unsafe'
};

export const getIcon = (iconType) => {
    if(!icons[iconType])
        throw Error("Not valid icon type.")
    return {
        16: `assets/icon/${iconType}/16x16.png`,
        57: `assets/icon/${iconType}/57x57.png`,
        120: `assets/icon/${iconType}/120x120.png`,
        310: `assets/icon/${iconType}/310x310.png`
    }
};

export {
    OriginDomain,
    DNS_TARGET_FQDN_URI,
    GOOGLE_DNS_HTTPS_RI_FN,
    GOOGLE_DNS_HTTPS_RR_FN,
    HASHING_ALGORITHM,
    HASHING_OUTPUT_LENGTH
};
