/** @flow
 *  @description All HASCHK popup UI logic goes here
 */

import './index.css'

import {
    EventFrameEmitter,
    portMessageToEventFrame,
    eventFrameToPortMessage,
} from 'universe/events'

import {
    clearPopupUI,
    redrawPopupUI,
} from 'universe/ui'

import {
    Debug,
    JUDGEMENT_UNKNOWN,
    JUDGEMENT_UNSAFE,
    JUDGEMENT_SAFE,
} from 'universe'

import type { EventFrame } from 'universe/events'

declare var chrome:any;

const oracle = new EventFrameEmitter();
const port = chrome.runtime.connect();
let dlItems = {};

const updateDlItemsAndRedrawPopupUI = downloadItem => {
    dlItems[downloadItem.id] = downloadItem;
    redrawPopupUI(dlItems);
};

// ? This fires when we receive a message from another component of the
// ? extension. We translate the message into an event and emit it
port.onMessage.addListener(data => {
    Debug.log(chrome, '[POPUP EVENT] (event and args received through port)', port, data);
    const { eventFrame, args } = portMessageToEventFrame(data);
    oracle.emitIgnoreGlobalListeners(eventFrame.name, eventFrame, ...args);
});

// ? Whenever an event is triggered, we send it out for any other
// ? interested components in the system to pick up on
const globalListener = oracle.addGlobalListener((eventFrame: EventFrame, args: Array<any>) => {
    Debug.log(chrome, '[POPUP EVENT] (event and args sent through port)', port, eventFrame, args);
    port.postMessage(eventFrameToPortMessage(eventFrame, args));
});

// ? When a port is destroyed for whatever reason (page refresh, popup
// ? closed, etc), remove the (dead) global listener associated with it
port.onDisconnect.addListener(() => {
    Debug.log(chrome, '[POPUP EVENT] (port disconnected)', port);
    oracle.removeGlobalListener(globalListener);
});

// ? These events cause a snappy "live" UI redraw when the popup is open

oracle.addListener('download.incoming', (e: EventFrame, downloadItem) => updateDlItemsAndRedrawPopupUI(downloadItem));
oracle.addListener(`judgement.${JUDGEMENT_UNKNOWN}`, (e: EventFrame, downloadItem) => updateDlItemsAndRedrawPopupUI(downloadItem));
oracle.addListener(`judgement.${JUDGEMENT_SAFE}`, (e: EventFrame, downloadItem) => updateDlItemsAndRedrawPopupUI(downloadItem));
oracle.addListener(`judgement.${JUDGEMENT_UNSAFE}`, (e: EventFrame, downloadItem) => updateDlItemsAndRedrawPopupUI(downloadItem));

// ? This event fires when we received an updated DownloadItems map
oracle.once('response.updateDownloadItems', (e: EventFrame, updatedDlItems) => {
    dlItems = updatedDlItems;
    redrawPopupUI(dlItems);
});

// ? Now we request an updated DownloadItems map!
oracle.emit('request.updateDownloadItems');

// TODO: add events for DOM elements (including clearing the UI)
