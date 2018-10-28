/** @flow */

export default class DnschkPort
{
    #port;
    constructor(chrome: any)
    {
        this.#port = chrome.runtime.connect();
    }

    emit(eventName, ...data)
    {
        this.#port.postMessage({
            event: eventName,
            data: data
        });
    }

    // TODO: Implement onMessage/on functionality
}
