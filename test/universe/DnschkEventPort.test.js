/** @flow */

import { DnschkEventPort, portEvent } from 'universe/DnschkEventPort'
import { EventEmitter } from 'eventemitter3'

let chrome  = {
    runtime: {}
};
let post;

chrome.runtime.connect = () => {
    return {
        onMessage: new EventEmitter(),
        postMessage: (event) => { post = event; }
    }
}

test('portEvent returns correctly formatted Event object', ()=>{
    let event = portEvent('demo', 1, 2, 3);
    expect(event).toBe({
        event: 'demo',
        data: [1, 2, 3]
    });
});
