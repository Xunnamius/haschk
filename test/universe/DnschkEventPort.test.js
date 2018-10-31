/** @flow */

import { DnschkEventPort, portEvent } from 'universe/DnschkEventPort'
import { EventEmitter } from 'eventemitter3'

let chrome  = {};
let post;

chrome.runtime.connect = () => {
    return {
        onMessage: new EventEmitter(),
        postMessage: (event) => { post = event; }
    }
}

beforeEach(()=>{
    let bridge = new DnschkEventPort(chrome);
});

test('portEvent returns correctly formatted object', ()=>{
    let event = portEvent('demo', 1, 2, 3);
    expect(event).toBo({
        event: 'demo',
        data: [1, 2, 3]
    });
});
