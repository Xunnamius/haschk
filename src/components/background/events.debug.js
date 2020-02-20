/** @flow
 *  @description Most of the core HASCHK logic and functionality is implemented here
 */

import { EventFrameEmitter } from 'universe/events'

import {
    Debug,
    JUDGEMENT_UNKNOWN,
    JUDGEMENT_UNSAFE,
    JUDGEMENT_SAFE,
} from 'universe'

import type { Chrome } from 'universe'
import type { EventFrame } from 'universe/events'

declare var crypto;

export default (oracle: EventFrameEmitter, chrome: Chrome) => {
    // ? This is our generic error handler that fires whenever an error occurs
    oracle.addListener('error', (errorFrame, exception, errorArgs) => {
        Debug.log(chrome, `ErrorFrame:`, errorFrame);
        Debug.log(chrome, `Exception object:`, exception);
        Debug.log(chrome, `ErrorArgs:`, errorArgs);

        console.error(`HASCHK ERROR: ${exception}`);
    });

    // * Debug-only event listeners

    Debug.if(() => oracle.addListener('startup', (e: EventFrame) => {
        console.log(`[BACKGROUND EVENT] ${e.name}:`, e);
    }));

    const downloadLogTemplate = (e: EventFrame, downloadItem) => {
        console.log(`[BACKGROUND EVENT] ${e.name}: ${downloadItem.finalUrl}`);
    };

    Debug.if(() => oracle.addListener('download.incoming', (e: EventFrame, downloadItem) => {
        downloadLogTemplate(e, downloadItem);
    }));

    Debug.if(() => oracle.addListener('download.paused', (e: EventFrame, downloadItem) => {
        downloadLogTemplate(e, downloadItem);
    }));

    Debug.if(() => oracle.addListener('download.resumed', (e: EventFrame, downloadItem) => {
        downloadLogTemplate(e, downloadItem);
    }));

    Debug.if(() => oracle.addListener('download.interrupted', (e: EventFrame, downloadItem) => {
        downloadLogTemplate(e, downloadItem);
    }));

    Debug.if(() => oracle.addListener('download.completed', (e: EventFrame, downloadItem) => {
        console.log(`[BACKGROUND EVENT] ${e.name}:`, e, downloadItem);
    }));

    const judgementLogTemplate = (e: EventFrame, downloadItem) => {
        console.log(`[BACKGROUND EVENT] ${e.name}: file "${downloadItem.filename}"`);
    };

    Debug.if(() => oracle.addListener(`judgement.${JUDGEMENT_UNKNOWN}`, (e: EventFrame, downloadItem) => {
        judgementLogTemplate(e, downloadItem);
    }));

    Debug.if(() => oracle.addListener(`judgement.${JUDGEMENT_SAFE}`, (e: EventFrame, downloadItem) => {
        judgementLogTemplate(e, downloadItem);
    }));

    Debug.if(() => oracle.addListener(`judgement.${JUDGEMENT_UNSAFE}`, (e: EventFrame, downloadItem) => {
        judgementLogTemplate(e, downloadItem);
    }));
};
