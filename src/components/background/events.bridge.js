/** @flow */

export default (oracle: any, chrome: any, context: any) => {
    oracle.addListener('bridge.fetch', (bridge,...keys) => {
        let values = {};
        keys.forEach((key) => {
            values[key] = context[key];
        });
        bridge.postMessage(values);
    });
}
