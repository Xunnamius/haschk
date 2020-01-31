/** @flow
 * @description global utility functions and constants
 */

// ? Returns a string HTTPS endpoint URI that will yield the desired resource
// ? identifier hash
export const GOOGLE_DNS_HTTPS_RI_FN = (riHashLeft: string, riHashRight: string, originDomain: string) =>
    `https://dns.google.com/resolve?name=${riHashLeft}.${riHashRight}.${haschk}.${originDomain}&type=TXT`;

// ? Returns a string HTTPS endpoint URI that will yield the desired resource
// ? range string
export const GOOGLE_DNS_HTTPS_RR_FN = (originDomain: string) =>
    `https://dns.google.com/resolve?name=_rr._haschk.${originDomain}&type=TXT`;

export const FRAMEWORK_EVENTS = ['download.incoming', 'download.completed', 'download.suspiciousOrigin'];

export const extractDomainFromURI = (url: string) => (new URL(url)).hostname.split('.').slice(-2).join('.');

export const extendDownloadItemInstance = (downloadItem: any) => {
    const uri: string = downloadItem.referrer || downloadItem.url;

    if(!uri) throw new Error('cannot determine originDomain');

    downloadItem.originDomain = extractDomainFromURI(uri);
    return downloadItem;
};

export const JUDGEMENT_SAFE = 'safe';
export const JUDGEMENT_UNSAFE = 'unsafe';
export const JUDGEMENT_UNKNOWN = 'unknown';

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
