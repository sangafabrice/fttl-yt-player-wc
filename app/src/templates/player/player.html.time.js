import { getFormattedDuration } from "../../utils/duration.util.js";
import { PROGRESS_DELAY } from "../progressBar/progressBar.css.js";
import { mapDOM } from "./player.dom.js";

/**
 * Updates the timer display with the current time.
 * @param {{ timerDisplay: { dataset: DOMStringMap } }} dom - The DOM map containing the timer display element.
 * @param {number} currentTime - Current playback time in seconds.
 */
function setCurrentTime({ timerDisplay: { dataset } }, currentTime) {
    dataset.currentTime = getFormattedDuration(currentTime);
}

/**
 * Updates the progress bar’s value and buffer state.
 * @param {{ progressBar: ProgressBar }} dom - The DOM map containing the progress bar element.
 * @param {number} currentTime - Current playback time in seconds.
 * @param {number} duration - Total media duration in seconds.
 * @param {number} bufferRate - Buffered percentage (0–1).
 */
function updateProgressBar({ progressBar }, currentTime, duration, bufferRate) {
    Object.assign(progressBar, {
        value: (currentTime + PROGRESS_DELAY)/duration,
        buffer: bufferRate
    });
}

/**
 * Updates an anchor element’s `href` with a `t` query parameter for current time.
 * @param {{ anchor: HTMLAnchorElement }} dom - The DOM map containing the anchor element.
 * @param {URL|null} url - The base URL to update, or `null` if none is available.
 * @param {number} currentTime - Current playback time in seconds.
 */
function setHrefCurrentTimeQuery({ anchor }, url, currentTime) {
    url?.searchParams.set("t", Math.floor(currentTime));
    url && (anchor.href = url);
}

/**
 * Renders the current playback time in all relevant DOM elements for a YouTube-like player.
 * This function updates:
 * - the timer display text,
 * - the progress bar value and buffer,
 * - and the anchor link query parameter (`t`) with the current time.
 * @param {YoutubePlayer} ytPlayer - The root player element.
 * @param {URL|null} url - Optional URL for updating the anchor link.
 * @param {number} currentTime - Current playback time in seconds.
 * @param {number} duration - Total media duration in seconds.
 * @param {number} bufferRate - Buffered percentage (0–1).
 */
export function renderCurrentTime(ytPlayer) {
    const dom = mapDOM(ytPlayer);
    setCurrentTime(dom, arguments[2]);
    updateProgressBar(dom, ...[...arguments].slice(2));
    setHrefCurrentTimeQuery(dom, ...[...arguments].slice(1, 3));
}

/**
 * Initializes and renders the total media duration across multiple timer elements.
 * - Sets the machine-readable `dateTime` attribute on the timer element.
 * - Updates the screen-reader–only timer element with a descriptive label.
 * - Stores a human-readable formatted duration in the dataset.
 * - Invokes the provided callback with the numeric duration value.
 * @param {{ duration: number }} ytEmbedPlayer - The adapted YouTube iframe player
 * object containing the total media duration in seconds.
 * @param {{
 *   timer: HTMLTimeElement,
 *   timerSROnly: HTMLSpanElement,
 *   timerDisplay: { dataset: DOMStringMap }
 * }} dom - Object containing the DOM elements to update.
 * @param {function(number): void} callback - Callback executed with the numeric duration.
 */
export function renderDuration({ duration }, { timer, timerSROnly, timerDisplay: { dataset } }, callback) {
    timer.dateTime = getFormattedDuration(duration, "machine");
    timerSROnly.innerText = "Duration: " + getFormattedDuration(duration, "sr-only");
    dataset.duration = getFormattedDuration(duration);
    callback(duration);
}