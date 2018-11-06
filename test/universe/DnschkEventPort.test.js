/** @flow */

import {
    DnschkEventPort,
    portEvent
} from 'universe/ui'
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

test('portEvent returns correctly formatted Event object', () =>{
    expect(portEvent('demo', 1)).toEqual({
        event: 'demo',
        data: [1]
    });
    expect(portEvent('demo', 1, 2, 3)).toEqual({
        event: 'demo',
        data: [1, 2, 3]
    });
});
