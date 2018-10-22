/** @flow
 * @description utility EventEmitter that works on browsers and in node
 */

import EventFrame from './EventFrame'
import InterruptibleEventFrame from './InterruptibleEventFrame'
import DownloadEventFrame from './DownloadEventFrame'
import FrameworkEventEmitter from './FrameworkEventEmitter'

export type ListenerFn = (...args: Array<any>) => (Promise<void> | void);

export {
    EventFrame,
    InterruptibleEventFrame,
    DownloadEventFrame,
    FrameworkEventEmitter as EventEmitter,
};
