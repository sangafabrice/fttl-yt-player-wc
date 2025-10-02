import { setLoadingState } from "./player.html.js";

const shouldPlayOnLoadMapper = Object.freeze(new WeakMap);

/**
 * Marks the current player instance as "should play on load".
 * Bound to the `mouseenter` event.
 * @this {YouTubePlayer} The YouTube player element.
 */
function setPlayOnLoad() {
    shouldPlayOnLoadMapper.set(this, true);
}

/**
 * Marks the current player instance as "should not play on load".
 * Bound to the `mouseleave` event.
 * @this {YouTubePlayer} The YouTube player element.
 */
function unsetPlayOnLoad() {
    shouldPlayOnLoadMapper.set(this, false);
}

/**
 * Registers mouse event listeners on the YouTube player to track
 * whether playback should auto-start when ready.  
 * Also sets the initial loading state for the player.
 * @param {YouTubePlayer} ytPlayer - The YouTube player element.
 */
export function registerPlayOnLoadListener(ytPlayer) {
    setLoadingState(ytPlayer, true);
    ytPlayer.addEventListener("mouseenter", setPlayOnLoad);
    ytPlayer.addEventListener("mouseleave", unsetPlayOnLoad);
}

/**
 * Decides whether the player should play immediately or defer until
 * the user hovers again. The decision is based on the internal WeakMap
 * set by {@link registerPlayOnLoadListener}.
 * @param {YouTubePlayer} ytPlayer - The YouTube player element.
 * @param {function(): void} playCallback - Function to trigger playback.
 * @returns {boolean} `true` if playback started immediately, `false` if deferred.
 */
export function playOnLoad(ytPlayer, playCallback) {
    const shouldPlay = shouldPlayOnLoadMapper.get(ytPlayer);
    shouldPlay
        ? playCallback()
        : ytPlayer.addEventListener("mouseenter", playCallback, { once: true });
    shouldPlayOnLoadMapper.delete(ytPlayer);
    return shouldPlay;
}

/**
 * Removes the "play on load" behavior from a YouTube player.  
 * This function ensures that mouse listeners and state listeners 
 * used for auto-play initialization are cleaned up.
 * @param {YouTubePlayer} ytPlayer - The YouTube player element.
 */
function unregisterPlayOnLoadListener(ytPlayer) {
    setLoadingState(ytPlayer, false);
    shouldPlayOnLoadMapper.delete(ytPlayer);
    ytPlayer.removeEventListener("statechange", unregisterPlayOnLoadListener);
    ytPlayer.removeEventListener("mouseenter", setPlayOnLoad);
    ytPlayer.removeEventListener("mouseleave", unsetPlayOnLoad);
}

/**
 * Event listener to unregister the "play on load" behavior
 * once the embedded YouTube IFrame player starts playback.
 * @event statechange
 * @type {CustomEvent<{ isPlaying: boolean }>}
 * @this {YouTubePlayer} The YouTube player element.
 * @param {CustomEvent<{ isPlaying: boolean }>} event - Fired when the state
 * of the embedded YT IFrame changes. This handler only unregisters listeners
 * if the new state indicates that playback has started (`isPlaying: true`).
 */
export function unregisterPlayOnLoadListenerOnLoadEnd({ detail: { isPlaying } }) {
    isPlaying && unregisterPlayOnLoadListener(this);
}