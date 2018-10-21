/* @flow */

import EventFrame from './EventFrame'

// TODO: document me!

export default class DownloadCrossOriginEventFrame extends EventFrame {
    _oracle: any;
    _context: any;

    constructor(oracle: any, context: any, callback: ?() => void) {
        super(
            () => {},
            callback || (() => {})
        );

        this._oracle = oracle;
        this._context = context;
    }

    async _shortCircuitEventLoop(eventName: string, downloadItem: any, ...args: Array<any>) {
        this.stop();
        this._context.handledDownloadItems.add(downloadItem.id);
        this.finish(...args);
        await this._oracle.emit(eventName, downloadItem);
    }

    // ? Returns a Promise!
    judgeUnsafe(downloadItem: any, ...args: Array<any>) {
        return this._shortCircuitEventLoop('judgement.unsafe', downloadItem, ...args);
    }

    // ? Returns a Promise!
    judgeSafe(downloadItem: any, ...args: Array<any>) {
        return this._shortCircuitEventLoop('judgement.safe', downloadItem, ...args);
    }

    // ? Returns a Promise!
    judgeUnknown(downloadItem: any, ...args: Array<any>) {
        return this._shortCircuitEventLoop('judgement.unknown', downloadItem, ...args);
    }
}
