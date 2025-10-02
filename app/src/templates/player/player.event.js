import { mapDOM } from "./player.dom.js";
import { playOnLoad, unregisterPlayOnLoadListenerOnLoadEnd } from "./player.event.load.js";
import registerOnMuteChangeListener from "./player.event.mutestate.js";
import { getOnTickHandler, registerPlayControlListener, shouldInitOnPlayStart } from "./player.event.play.js";
import { registerOnVideoChangeListener } from "./player.event.reset.js";
import { renderTitle } from "./player.html.render.js";
import { renderDuration } from "./player.html.time.js";

/**
 * Registers a one-time listener that starts ticking logic
 * and initializes play-state behavior when the YouTube player
 * begins playback for the first time.
 * @param {YouTubePlayer} ytPlayer - The custom player element wrapping the YouTube IFrame.
 * @param {Function} initPlayStateCallback - Called once when playback starts to set up initial state.
 * @param {function(YT.Player): void} onTickCallback - Called every second with the underlying YT IFrame player instance.
 */
export function registerOnPlayStartListener(ytPlayer, initPlayStateCallback, onTickCallback) {
    ytPlayer.addEventListener("statechange", getOnTickHandler(ytPlayer, onTickCallback), { once: true });
    ytPlayer.addEventListener("statechange", unregisterPlayOnLoadListenerOnLoadEnd);
    const handler = event => shouldInitOnPlayStart.apply(ytPlayer, [initPlayStateCallback, event, handler]);
    ytPlayer.addEventListener("statechange", handler);
}

/**
 * Registers the initialization logic to run when the YouTube IFrame
 * API signals that the player is ready.
 * This sets up:
 * - "Play on load" behavior
 * - Title rendering
 * - Duration display
 * - Mute/unmute toggle handling
 * - Hover-based play/pause controls
 * @param {YouTubePlayer} ytPlayer - The custom player element wrapping the YouTube IFrame.
 * @param {function(number): void} setDurationPropCallback - Callback to update the duration property.
 * @param {function(YT.Player): void} playCallback - Called when the player should start playing (e.g. on mouseenter).
 * @param {function(YT.Player): void} pauseCallback - Called when the player should pause (e.g. on mouseleave).
 */
export function registerOnReadyListener(ytPlayer, setDurationPropCallback, playCallback, pauseCallback) {
    ytPlayer.addEventListener(
        "ready",
        function ({ detail: ytEmbedPlayer }) {
            playOnLoad(this, ytEmbedPlayer.playVideo);
            renderTitle(this, ytEmbedPlayer, mapDOM(this));
            renderDuration(ytEmbedPlayer, mapDOM(this), setDurationPropCallback);
            const onMuteHandler = registerOnMuteChangeListener(ytEmbedPlayer, mapDOM(this));
            registerPlayControlListener(this, ytEmbedPlayer, playCallback, pauseCallback);
            registerOnVideoChangeListener(this, ytEmbedPlayer.destroy, onMuteHandler);
        },
        { once: true }
    );
}