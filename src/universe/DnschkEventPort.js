/** @flow */

// TODO: Document me

// ? In hindsight, this class could be made skinnier. We could easily remove
// ? the emit event functionality and this class would still do everything it needs to.
// ? I will leave it in for now but now that this will probably get removed unless
// ? someone finds a use for it.

export function portEvent(event, ...data)
{
    if(data.length == 1)
    {
        return {
            event: event,
            data: [data[0]]
        }
    }
    return {
        event: event,
        data: data
    }
}

export default class DnschkEventPort
{
    #port;
    constructor(chrome: any)
    {
        this.#port = chrome.runtime.connect();
        this.handlers = {};

        this.#port.onMessage.addListener((message)=>{
            if(message.event != undefined)
            {
                this.handlers[message.event](...message.data);
            }
        });
    }

    on(event: string, callback: (...data) => any)
    {
        this.handlers[event] = callback;
    }

    async emit(_event: string,..._data: any)
    {
        return await new Promise((resolve)=>{
            this.#port.postMessage(portEvent(_event, ..._data));
            this.#port.onMessage.addListener((event_response)=>{
                this.#port.onMessage.removeListener();
                resolve(event_response);
            });
        });
    }
}
