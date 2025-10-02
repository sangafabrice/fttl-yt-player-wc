import { mapDOM, resetDOM } from "./player.dom.js";

/**
 * Registers a handler to reset the YouTube player’s DOM when the video changes.
 * This function extends the mapped DOM (`mapDOM`) of the custom YouTube
 * player component by attaching a `derefiframe` method.  
 * Calling `derefiframe` will:
 *  - Destroy the current YouTube embed player (via `ytEmbedPlayerDestroyFn`).
 *  - Remove the mute/unmute button’s click event listener.
 *  - Reset the player’s shadow DOM to its initial state (via {@link resetDOM}).
 * @param {YouTubePlayer} ytPlayer - The custom `<fttl-yt-player>` element instance.
 * @param {Function} ytEmbedPlayerDestroyFn - A callback that destroys the underlying `YT.Player` instance.
 * @param {Function} onMuteHandler - The event handler bound to the sound button (mute/unmute toggle).
 */
export function registerOnVideoChangeListener(ytPlayer, ytEmbedPlayerDestroyFn, onMuteHandler) {
    const dom = mapDOM(ytPlayer);
    dom.derefiframe = function () {
        ytEmbedPlayerDestroyFn();
        dom.soundButton.removeEventListener("click", onMuteHandler);
        resetDOM(ytPlayer);
    };
}