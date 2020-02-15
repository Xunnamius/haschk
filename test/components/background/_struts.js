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
        onInstalled: eePlaceholder(),
    },

    webRequest: {
        onBeforeRequest: eePlaceholder(),
        onErrorOccurred: eePlaceholder(),
    },

    downloads: {
        onCreated: eePlaceholder(),
        onChanged: eePlaceholder(),
    }
};

export const context = {
    downloadItems: new Map(),
    navHistory: new Map(),
};
