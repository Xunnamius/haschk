/** @flow
 * @description utility EventEmitter that works on browsers and in node
 */

import DownloadCrossOriginEventFrame from './DownloadCrossOriginEventFrame'
import DownloadNewEventFrame from './DownloadNewEventFrame'
import EventFrame from './EventFrame'
import DnschkEventEmitter from './DnschkEventEmitter'

export type ListenerFn = (...args: Array<any>) => (Promise<void> | void);

export {
    DnschkEventEmitter as EventEmitter,
    DownloadCrossOriginEventFrame,
    DownloadNewEventFrame,
    EventFrame
};
