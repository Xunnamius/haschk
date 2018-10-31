/** @flow */

// TODO: Document me

export default class DnschkPort
{
    #port;
    constructor(chrome: any)
    {
        this.#port = chrome.runtime.connect();
    }

    async emit(_event: string,..._data: any)
    {
        return await new Promise((resolve)=>{
            this.#port.postMessage({
                event: _event,
                data: _data
            });
            this.#port.onMessage.addListener((event_response)=>{
                this.#port.onMessage.removeListener();
                resolve(event_response);
            });
        });
    }
}
