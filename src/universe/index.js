/** @flow
 * @description global utility functions and constants
 */

export const DANGER_THRESHOLD = 2000;

// ? Returns a string HTTPS endpoint URI that will yield the desired resource
// ? identifier hash
export const GOOGLE_DNS_HTTPS_RI_FN = (riHashLeft: string, riHashRight: string, originDomain: string) =>
    `https://dns.google.com/resolve?name=${riHashLeft}.${riHashRight}._ri._dnschk.${originDomain}&type=TXT`;

// ? Returns a string HTTPS endpoint URI that will yield the desired resource
// ? range string
export const GOOGLE_DNS_HTTPS_RR_FN = (originDomain: string) =>
    `https://dns.google.com/resolve?name=_rr._dnschk.${originDomain}&type=TXT`;

export const { HASHING_ALGORITHM, HASHING_OUTPUT_LENGTH } = process.env;

export const FRAMEWORK_EVENTS = ['download.incoming', 'download.completed', 'download.suspiciousOrigin'];

export const extractDomainFromURI = (url: string) => (RegExp(/^(.*?:\/\/+)?(.+?)(\/.*)?$/g).exec(url) ?? [])[2];

export const extendDownloadItemInstance = downloadItem => {
    downloadItem.originDomain = extractDomainFromURI(
        downloadItem.referrer || downloadItem.url || throw new Error('cannot determine originDomain')
    );

    return downloadItem;
};
