import YoutubeIFrameConverter from "./ytIFrame.converter.js";
import { httpTestVideoId } from "../../utils/videoIdValidation.http.js";

/**
 * @classdesc
 * Singleton utility for creating and managing YouTube `<iframe>` elements
 * that are backed by the YouTube IFrame API.  
 * - Creates new iframes or wraps existing ones.
 * - Observes `data-src` attribute changes with a {@link MutationObserver}.
 * - Validates video IDs using {@link httpTestVideoId}.
 * - Automatically converts valid iframes into YouTube IFrame API players
 *   via {@link YoutubeIFrameConverter}.
 */
class YoutubeIFrame {
    /**
     * Singleton instance holder.
     * @type {YoutubeIFrame}
     * @private
     */
    static #creator;

    /**
     * Returns the singleton instance.
     * Ensures that only one `YoutubeIFrame` instance exists.
     * @returns {YoutubeIFrame}
     */    
    constructor() {
        return (
            YoutubeIFrame.#creator ??
            (YoutubeIFrame.#creator = Object.freeze(this))
        );
    }

    /**
     * Creates a managed `<iframe>` element or attaches observation to an existing one.
     * The returned iframe is automatically observed for `data-src` changes.
     * @param {HTMLIFrameElement} [newiframe] - Optional iframe to manage.
     * @returns {HTMLIFrameElement} The created or managed iframe element.
     */
    create(newiframe) {
        const iframe = newiframe ?? document.createElement("iframe");
        this.#attributeChangedObserver.observe(iframe, {
            attributeFilter: ["data-src"],
            attributes: true,
            attributeOldValue: true,
        });
        return iframe;
    }

    /**
     * Mutation observer instance that watches for `data-src` attribute changes.
     * @type {MutationObserver}
     * @private
     */
    #attributeChangedObserver = new MutationObserver(records =>
        records.forEach(YoutubeIFrame.#attributeChangedCallback)
    );

    /**
     * Handles `data-src` attribute changes on observed iframes.
     * Validates the video ID before converting the iframe into a YouTube player.
     * @param {MutationRecord} param0 - Mutation record from the observer.
     * @param {HTMLIFrameElement} param0.target - The mutated iframe.
     * @param {string} param0.oldValue - The previous `data-src` value.
     * @returns {Promise<void>}
     * @private
     */
    static async #attributeChangedCallback({ target, oldValue }) {
        const videoId = target.dataset.src;
        if (!await httpTestVideoId(videoId) || oldValue == videoId)
            return;
        YoutubeIFrameConverter.convert(target);
    }
}

/**
 * @module YoutubeIFrame
 * @example
 * import YoutubeIFrame from "./YoutubeIFrame.js";
 *
 * // Create a managed iframe
 * const iframe = YoutubeIFrame.create();
 * iframe.dataset.src = "VIDEO_ID"; // triggers conversion
 * document.body.appendChild(iframe);
 *
 * // Or manage an existing iframe
 * const iframe = document.querySelector("iframe[data-src]");
 * YoutubeIFrame.create(iframe);
 */
export default new YoutubeIFrame;