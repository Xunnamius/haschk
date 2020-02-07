/** @flow
 * @description HASCHK background functionality
 * @name Background
 */

import { Debug } from 'universe'
import { EventFrameEmitter } from 'universe/events'

import registerChromeEvents from 'components/background/events.chrome'
import registerCoreEvents from 'components/background/events.core'
import registerUIEvents from 'components/background/events.ui'

// ? `oracle` emits the events that you should be hooking into. Feel free to add
// ? more events as they become necessary.

// ? All extension events:
// ?   * startup                   The extension is loaded by chrome (once)    async (EventFrame, Details) => {}
// ?   * download.incoming         A new download has been observed            async (EventFrame, DownloadItem*) => {}
// ?   * download.completed        A download has completed; must be prepended async (EventFrame, DownloadItem) => {}
// ?   * judgement.safe            A resource's content is as expected         async (EventFrame, DownloadItem) => {}
// ?   * judgement.unsafe          A resource's content is mutated/corrupted   async (EventFrame, DownloadItem) => {}
// ?   * judgement.unknown         A resource's content cannot be judged       async (EventFrame, DownloadItem) => {}
// ?   * error                     An error event occurred (NOT `await`-ed!)  (EventFrame, Exception) => {}
// ?   * popup.ui.clear            Clear the entries in the popup ui           async (EventFrame) => {}

// ? Main extension event flow (excluding UI updates, options, ports):
// ?   1. Chrome enables extension (only once):    => startup
// ?   2. User triggered download:                 => download.incoming => #3
// ?   3. Triggered (unhandled) download finishes: => download.completed => #5
// ?   4. Some error occurs:                       => error
// ?   5. A judgement is rendered:                 => judgement.safe | judgement.unsafe | judgement.unknown

// ? * Note that, for listeners attached to the `download.incoming` event, the
// ? `DownloadItem` instance is missing many of its properties, including
// ? HASCHK-specific extensions (see `universe/index.js`). Do not expect them to
// ? exist until the `download.complete` event and others later in the flow.

const oracle = new EventFrameEmitter();
const context = {
    // ? (download) id -> DownloadItem
    downloadItems: new Map(),

    // ? requestId -> request stack [req n, ..., req 1]
    // ! Limited to 1000 requests!
    navHistory: new Map()
};

declare var chrome: any;

Debug.if(() => console.warn('!! == HASCHK IS IN DEVELOPER MODE == !!'));

registerChromeEvents(oracle, chrome, context);
registerCoreEvents(oracle, chrome, context);
registerUIEvents(oracle, chrome, context);
