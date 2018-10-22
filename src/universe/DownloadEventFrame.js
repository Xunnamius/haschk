/* @flow */

import InterruptibleEventFrame from './InterruptibleEventFrame'
import type { FrameworkEventEmitter } from 'universe/events'

// TODO: document me!

export default class DownloadEventFrame extends InterruptibleEventFrame {
    _context: any;

    constructor(oracle: FrameworkEventEmitter, context: {}, callback: ?() => void) {
        super(oracle, null, callback);
        this._context = context;
    }

    async shortCircuitEventLoop(eventName: string, downloadItem: any, ...args: Array<any>) {
        this._context.handledDownloadItems.add(downloadItem.id);
        await super.shortCircuitEventLoop(eventName, downloadItem, ...args);
    }

    // ? Returns a Promise!
    judgeUnsafe(downloadItem: any, ...args: Array<any>) {
        return this.shortCircuitEventLoop('judgement.unsafe', downloadItem, ...args);
    }

    // ? Returns a Promise!
    judgeSafe(downloadItem: any, ...args: Array<any>) {
        return this.shortCircuitEventLoop('judgement.safe', downloadItem, ...args);
    }

    // ? Returns a Promise!
    judgeUnknown(downloadItem: any, ...args: Array<any>) {
        return this.shortCircuitEventLoop('judgement.unknown', downloadItem, ...args);
    }
}
