/**
 * Returns a function that starts a 1-second ticking interval
 * dispatching the given callback with the embedded player.
 * @param {YouTubePlayer} ytPlayer - The custom YouTube player element.
 * @param {function(YT.Player): void} onTickCallback - Function to call every second with the embedded player.
 * @returns {() => number} A bound `setInterval` function. Call it to start the interval and receive its ID.
 * @example
 * const startTick = getOnTickHandler(ytPlayer, player => console.log(player.getCurrentTime()));
 * const intervalId = startTick(); // runs every 1s
 */
export function getOnTickHandler(ytPlayer, onTickCallback) {
    return function onTickHandler({ detail: ytEmbedPlayer }) {
        if (ytEmbedPlayer.videoId != ytPlayer.videoId) return;
        onTickCallback.apply(ytPlayer, [ytEmbedPlayer]);
        setTimeout(onTickHandler, 1000, ...arguments);
    }
}

/**
 * Handles a `statechange` event and triggers initialization when playback starts.
 * - Calls the provided init callback when `isPlaying` is `true`.
 * - Automatically removes the event listener after the first run.
 * @this {YouTubePlayer} - The custom YouTube player element.
 * @param {function(): void} initPlayStateCallback - Initialization callback to run when playback starts.
 * @param {CustomEvent<{ isPlaying: boolean }>} event - The statechange custom event.
 * @param {function(CustomEvent): void} handler - The event listener to remove once initialization runs.
 */
export function shouldInitOnPlayStart(initPlayStateCallback, { detail: { isPlaying } }, handler) {
    if (!isPlaying) return;
    initPlayStateCallback.apply(this);
    this.removeEventListener("statechange", handler);
}

/**
 * Registers hover-based play/pause controls on a YouTube player element.
 * - Plays the video when the user hovers over the element.
 * - Pauses the video when the user leaves the element.
 * @param {YouTubePlayer} ytPlayer - The custom YouTube player element.
 * @param {YT.Player} ytEmbedPlayer - The YouTube IFrame API player instance.
 * @param {function(YT.Player): void} playCallback - Function to invoke on mouse enter.
 * @param {function(YT.Player): void} pauseCallback - Function to invoke on mouse leave.
 */
export function registerPlayControlListener(ytPlayer, ytEmbedPlayer, playCallback, pauseCallback) {
    ytPlayer.addEventListener("mouseenter", playCallback.bind(ytPlayer, ytEmbedPlayer));
    ytPlayer.addEventListener("mouseleave", pauseCallback.bind(ytPlayer, ytEmbedPlayer));
}