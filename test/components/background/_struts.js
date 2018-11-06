export const oracle = {
    calls: [],
    _push(name, args) { this.calls.push({ name, args }); },
    addListener(...args) { this._push('addListener', args); },
    emit(...args) { this._push('emit', args); },
};

// TODO: DRY this out
export const chrome = {
    runtime: {
        onConnect: {
            calls: [],
            _push(name, args) { this.calls.push({ name, args }); },
            addListener(...args) { this._push('addListener', args); }
        }
    },

    tabs: {
        onUpdated: {
            calls: [],
            _push(name, args) { this.calls.push({ name, args }); },
            addListener(...args) { this._push('addListener', args); }
        }
    },

    downloads: {
        onDeterminingFilename: {
            calls: [],
            _push(name, args) { this.calls.push({ name, args }); },
            addListener(...args) { this._push('addListener', args); }
        },

        onChanged: {
            calls: [],
            _push(name, args) { this.calls.push({ name, args }); },
            addListener(...args) { this._push('addListener', args); }
        }
    }
};

export const context = {
    handledDownloadItems: new Set(),
    judgedDownloadItems: [],
    registeredPorts: [],
    activePorts: [],
    timingData: {}
};
