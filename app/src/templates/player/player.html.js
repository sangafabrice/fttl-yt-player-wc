import { PLAYER_LOADING_CSS_CLASS } from "./player.css.js";
import { mapDOM } from "./player.dom.js";

/**
 * Toggles the mute state of the embedded YouTube player
 * and reflects it on the sound button’s `aria-pressed` attribute.
 * ⚠️ Note: Muting/unmuting is implemented by toggling the
 * player volume internally, so `isMuted()` is checked
 * before calling the opposite action.
 * @param {{ soundButton: HTMLButtonElement }} dom - Mapped DOM references containing the sound button.
 * @param {{
 *   isMuted: () => boolean,
 *   mute: () => void,
 *   unMute: () => void
 * }} ytEmbedPlayer - YouTube iframe API player instance.
 */
export function updateSoundButton({ soundButton }, ytEmbedPlayer) {
    const isMuted = ytEmbedPlayer.isMuted();
    soundButton.ariaPressed = isMuted;
    isMuted ? ytEmbedPlayer.unMute() : ytEmbedPlayer.mute();
}

/**
 * Sets or clears the "loading" state on the player by toggling
 * a CSS class on the thumbnail element.
 * @param {YouTubePlayer} ytPlayer - The YouTube player custom element.
 * @param {boolean} isLoading - Whether the player should display a loading state.
 */
export function setLoadingState(ytPlayer, isLoading) {
    mapDOM(ytPlayer).thumbnail.classList.toggle(PLAYER_LOADING_CSS_CLASS, isLoading);
}