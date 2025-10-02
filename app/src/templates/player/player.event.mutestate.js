import { updateSoundButton } from "./player.html.js";

/**
 * Creates an event handler for toggling mute/unmute state of the player.
 * The returned handler:
 * - Stops event propagation so the click does not bubble up.
 * - Calls {@link updateSoundButton} to synchronize the mute state
 *   of the embedded player with the UI button state.
 * @param {YT.Player} ytEmbedPlayer - The YouTube IFrame player instance.
 * @returns {function(MouseEvent): void} A click event handler bound to the player.
 */
function getOnMuteChangeHandler(ytEmbedPlayer) {
    return function (event) {
        event.stopPropagation();
        updateSoundButton({ soundButton: this }, ytEmbedPlayer);
    };
}

/**
 * Registers a mute/unmute toggle listener on the given sound button.
 * Behavior:
 * - Adds a click listener that updates both the mute state of the
 *   YouTube player and the `aria-pressed` attribute of the button.
 * - Programmatically triggers a `.click()` immediately so that
 *   the UI and the player start in a synchronized state.
 * @param {YT.Player} ytEmbedPlayer - The YouTube IFrame player instance.
 * @param {{ soundButton: HTMLButtonElement }} dom - An object containing the sound button element.
 */
export default function registerOnMuteChangeListener(ytEmbedPlayer, { soundButton }) {
    const handler = getOnMuteChangeHandler(ytEmbedPlayer);
    soundButton.addEventListener("click", handler);
    soundButton.click();
    return handler;
}