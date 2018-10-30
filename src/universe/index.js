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

export const extractDomainFromURI = (url: string) => (new URL(url)).hostname;

export const extendDownloadItemInstance = (downloadItem: any) => {
    const uri: string = downloadItem.referrer || downloadItem.url;

    if(!uri) throw new Error('cannot determine originDomain');

    downloadItem.originDomain = extractDomainFromURI(uri);
    return downloadItem;
};
