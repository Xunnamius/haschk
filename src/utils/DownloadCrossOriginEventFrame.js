/* @flow */

import EventFrame from './EventFrame'

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

    _shortCircuitEventLoop(eventName: string, downloadItem: any, ...args: Array<any>) {
        this.stop();
        this._context.handledDownloadItems.add(downloadItem.id);
        this.finish(...args);
        this._oracle.emit(eventName, downloadItem);
    }

    judgeUnsafe(downloadItem: any, ...args: Array<any>) {
        this._shortCircuitEventLoop('judgement.unsafe', downloadItem, ...args);
    }

    judgeSafe(downloadItem: any, ...args: Array<any>) {
        this._shortCircuitEventLoop('judgement.safe', downloadItem, ...args);
    }

    judgeUnknown(downloadItem: any, ...args: Array<any>) {
        this._shortCircuitEventLoop('judgement.unknown', downloadItem, ...args);
    }
}
