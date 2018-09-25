import http from 'faxios'

const DNS_TARGET_FQDN_URI = 'bernarddickens.com';
const GOOGLE_DNS_TARGET_URI = (resourceHash1, resourceHash2, targetDomain) =>
    `https://dns.google.com/resolve?name=${resourceHash1}.${resourceHash2}._dnschk.${targetDomain}&type=TXT`;

// ? This event fires with the DownloadItem object when a download begins
chrome.downloads.onCreated.addListener(downloadItem => console.log('downloads.onCreated listener called!', downloadItem));

// ? This event fires with a DownloadItem object when some download-related event changes
chrome.downloads.onChanged.addListener(downloadItem => {
    console.log('downloads.onChanged listener called!', downloadItem);

    if(downloadItem?.state?.current == 'complete')
        console.log('download completed');
});

