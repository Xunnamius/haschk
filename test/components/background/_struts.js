const eePlaceholder = () => ({
    calls: [],
    _push(name, args) { this.calls.push({ name, args }); },
    addListener(...args) { this._push('addListener', args); },
    emit(...args) { this._push('emit', args); }
});

export const oracle = eePlaceholder();

export const chrome = {
    runtime: {
        onConnect: eePlaceholder(),
        onInstalled: eePlaceholder()
    },

    tabs: {
        onUpdated: eePlaceholder()
    },

    downloads: {
        onDeterminingFilename: eePlaceholder(),
        onChanged: eePlaceholder()
    }
};

export const context = {
    handledDownloadItems: new Set(),
    judgedDownloadItems: [],
    seenPortNames: [],
    seenPorts: [],
    navHistory: {}
};
