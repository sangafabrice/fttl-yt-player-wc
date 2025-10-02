import Resolution from "../../utils/resolution.util.js";
import { httpRequestThumbnail } from "../../utils/thumbUrl.http.js";
import { httpTestVideoId } from "../../utils/videoIdValidation.http.js";
import { appendPrevThumb, getResolutionCSSRule, setThumbnail } from "./thumbnail.css.js";

const [HQ_MAX_WIDTH, SD_MAX_WIDTH] = [480, 640];

/**
 * Checks whether the thumbnail element is ready to request images.
 * A thumbnail is considered "ready" if the video ID is valid
 * and the element is connected to the DOM.
 * @param {{ videoId: string, isConnected: boolean }} ytThumb - Thumbnail element state.
 * @returns {Promise<boolean>} Resolves to `true` if ready, otherwise `false`.
 * @private
 */
async function isReady({ videoId, isConnected }) {
    return (await httpTestVideoId(videoId)) && isConnected;
}

/**
 * Applies a downloaded thumbnail to a custom YouTube thumbnail element.
 * This function performs the following steps:
 * 1. Updates the CSS rule for the given resolution with the downloaded image.
 * 2. Marks the resolution as loaded by setting a property on the element.
 * 3. Waits briefly (500ms) to allow the browser to apply the style changes.
 * 4. Appends the thumbnail as the "previous" image for smooth transitions.
 * @param {YouTubeThumbnail} ytThumb - The custom thumbnail element.
 * @param {string} resolution - The resolution identifier (e.g., "default", "hq", "maxres").
 * @param {string} blobUrl - The object URL of the downloaded thumbnail image.
 * @returns {Promise<void>} Resolves once the thumbnail has been applied and transition prepared.
 */
async function applyDownloadedThumbnail(ytThumb, resolution, blobUrl) {
    setThumbnail(await getResolutionCSSRule(ytThumb, resolution), resolution, blobUrl);
    ytThumb[resolution] = true;
    await new Promise(r => setTimeout(r, 500));
    appendPrevThumb(ytThumb, blobUrl);
}

/**
 * Internal function that selects and attempts to load the best thumbnail resolution
 * based on the current width. If a resolution is not available, it falls back to
 * lower ones until success or termination.
 * @param {YouTubeThumbnail} ytThumb - The thumbnail element.
 * @param {number} maxWidth - Current maximum available width.
 * @param {boolean} firstCompare - Whether this is the first comparison (used to allow retries).
 * @returns {Promise<[HTMLElement, number, boolean]|null>} - Next arguments for iteration,
 * or `null` if the maximum resolution has been set and no further work is needed.
 * @private
 */
async function _setThumbnailOnResize(ytThumb, maxWidth, firstCompare) {
    let resAttr = maxWidth <= HQ_MAX_WIDTH ? Resolution.hq : maxWidth <= SD_MAX_WIDTH ? Resolution.sd : Resolution.maxres;
    // Ensure we don't shrink width (always keep the largest seen so far).
    arguments[1] = maxWidth = Math.max(maxWidth, ytThumb.clientWidth);
    if (!(navigator.onLine && await isReady(ytThumb))) return [...arguments];
    if (
        (firstCompare || resAttr == Resolution.maxres) &&
        (await httpRequestThumbnail(ytThumb, resAttr)
            .then(applyDownloadedThumbnail.bind(null, ytThumb, resAttr))
            .then(() => false)
            .catch(err => !(
                err == null &&
                [Resolution.hq, Resolution.sd].some(res => ytThumb.getAttributeNames().indexOf(res) + 1)
            )))
    ) {
        // Retry with a fallback resolution.
        arguments[1] = resAttr == Resolution.maxres ? SD_MAX_WIDTH : HQ_MAX_WIDTH;
        return [...arguments];
    }
    if (resAttr == Resolution.maxres) return null;
    ytThumb[resAttr] = true;
    arguments[arguments.length - 1] = false;
    return [...arguments];
}

/**
 * Continuously updates the thumbnail resolution of a custom element
 * in response to its width changes.
 * The update task runs on a polling loop (every 500ms) and stops
 * automatically when the `videoId` of the element changes.  
 * This ensures that once the element points to a different video,
 * stale update tasks will not continue running.
 * @param {YouTubeThumbnail} ytThumb - The thumbnail element.
 */
export default function setThumbnailOnResize(ytThumb) {
    let watch = Promise.resolve([ytThumb, ytThumb.clientWidth, true]),
        args = [];
    const { videoId } = ytThumb,
        diffId = () => videoId != ytThumb.videoId;
    const task = async function () {
        args = await watch;
        if (diffId() || !args) return;
        watch = _setThumbnailOnResize(...args);
        setTimeout(task, 500);
    };
    task();
}