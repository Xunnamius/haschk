/* @flow */

// TODO: document me!

import EventFrame from './EventFrame'

export default class DownloadNewEventFrame extends EventFrame {
    _suggestion = {};

    constructor(suggestFilenameFn: ({}) => void) {
        super(() => {}, () => {});

        this._continueFn = suggestion => this._suggestion = suggestion ?? this._suggestion;
        this._finishedFn = () => suggestFilenameFn(this._suggestion);
    }
}
