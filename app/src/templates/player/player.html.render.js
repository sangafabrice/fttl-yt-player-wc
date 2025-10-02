import getVideoUrl from "../../utils/videoUrl.util.js";
import { mapDOM, renderDOM } from "./player.dom.js";

/**
 * Renders and locks the `videoId` for a YouTube player component.
 * - Updates the anchor’s `href`.
 * - Stores the `videoId` on the thumbnail and iframe dataset.
 * - Returns a frozen `URL` instance pointing to the YouTube video.
 * @param {YouTubePlayer} ytPlayer - The YouTube player custom element.
 * @param {{
 *   anchor: HTMLAnchorElement,
 *   ytiframe: { dataset: DOMStringMap },
 *   thumbnail: YouTubeThumbnail
 * }} dom - Mapped DOM references for the player.
 * @returns {Readonly<URL>} Frozen URL instance for the YouTube video.
 */
function renderVideoId({ videoId }, { anchor, ytiframe: { dataset }, thumbnail }) {
    return Object.freeze(new URL((anchor.href = getVideoUrl(Object.assign(thumbnail, { videoId: (dataset.src = videoId) })))));
}

/**
 * Locks the `videoId` property of the player object so it cannot be reassigned.
 * @param {YouTubePlayer} ytPlayer - The YouTube player custom element.
 */
function lockVideoId(ytPlayer) {
    Object.defineProperty(ytPlayer, "videoId", {
        value: ytPlayer.videoId,
        writable: false,
        configurable: false,
        enumerable: false,
    });
}

/**
 * Renders the title into the anchor element while reflecting it on the player.
 * @param {YouTubePlayer} ytPlayer - The YouTube player custom element.
 * @param {{ title: string }} ytEmbedPlayer - The adapted YouTube iframe player
 * object containing the video title.
 * @param {{ anchor: HTMLAnchorElement }} dom - Anchor element reference.
 */
export function renderTitle(ytPlayer, { title }, { anchor }) {
    anchor.innerText = `Watch "${Object.assign(ytPlayer, { title }).title}" on Youtube`;
}

/**
 * Renders the player DOM and applies video metadata.
 * @param {YouTubePlayer} ytPlayer - The YouTube player custom element.
 * @param {function(Readonly<URL>): void} callback - Callback invoked with the frozen YouTube video URL.
 */
export function render(ytPlayer, callback) {
    renderDOM(ytPlayer);
    callback(renderVideoId(ytPlayer, mapDOM(ytPlayer)));
}