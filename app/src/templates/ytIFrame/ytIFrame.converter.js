import ytIFrameApiReady from "./ytIFrame.api.ready.js";
import { dispatchOnReady, dispatchOnStateChange } from "./ytIFrame.event.js";

const ENCODED_BASE_URL = encodeURIComponent(window.location.origin);
const ENCODED_URL = encodeURIComponent(window.location.href);

/**
 * @classdesc
 * Converts a plain `<iframe>` element with a `data-src` YouTube video ID into a fully
 * functional YouTube IFrame Player instance.  
 * - Ensures the iframe has the correct attributes (origin, referrerPolicy, controls, etc.).
 * - Waits for the YouTube IFrame API to be ready before initializing the player.
 * - Binds lifecycle events (`onReady`, `onStateChange`) and re-dispatches them
 *   as custom DOM events (`ready`, `statechange`) via
 *   {@link dispatchOnReady} and {@link dispatchOnStateChange}.
 */
export default class YoutubeIFrameConverter {
    constructor () {
        // Returning the class itself makes this more of a static utility holder
        return YoutubeIFrameConverter;
    }
    
    /**
     * Converts a given iframe into a YouTube IFrame Player instance.
     * @param {HTMLIFrameElement} iframe - The iframe element with a `data-src` attribute
     * containing the YouTube video ID.
     */
    static convert (iframe) {
        this.#setAttributes.apply(iframe, [iframe.dataset.src]);
        this.#setPlayer.apply(iframe);
    }

    /**
     * Sets required iframe attributes for YouTube embedding.
     * @param {string} videoId - The YouTube video ID taken from `data-src`.
     * @private
     */
    static #setAttributes (videoId) {
        Object.assign(this, {
            allow: [
                "accelerometer",
                "autoplay",
                "clipboard-write",
                "encrypted-media",
                "gyroscope",
                "picture-in-picture"
            ].join("; "),
            referrerPolicy: "strict-origin-when-cross-origin",
            src: `https://www.youtube-nocookie.com/embed/${videoId}?` + Object.entries({
                playlist: videoId,
                playsinline: 1,
                controls: 0,
                mute: 0,
                loop: 1,
                modestbranding: 0,
                rel: 0,
                enablejsapi: 1,
                disablekb: 1,
                fs: 0,
                origin: ENCODED_BASE_URL,
                widget_referrer: ENCODED_URL
            }).map(entry => entry.join("=")).join("&")
        }).removeAttribute("data-src");
    }

    /**
     * Initializes the YouTube Player instance on the iframe once the API is ready.
     * @fires ready
     * @fires statechange
     * @private
     */
    static async #setPlayer () {
        await ytIFrameApiReady &&
        new YT.Player(this, {
            events: {
                onReady: dispatchOnReady.bind(this),
                onStateChange: dispatchOnStateChange.bind(this)
            }
        });
    }
}