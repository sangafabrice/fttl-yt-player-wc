import { unmapDOM } from "./templates/thumbnail/thumbnail.dom.js";
import { defineResolutionAttribute, render } from "./templates/thumbnail/thumbnail.html.js";
import { reflectAttribute, reflectBooleanAttribute } from "./utils/reflection.util.js";
import { httpTestVideoId } from "./utils/videoIdValidation.http.js";

const VIDEO_ID_ATTR_NAME = "video-id";
const YT_ELEMENT_NAME = "fttl-yt-thumb";

/**
 * Custom element `<fttl-yt-thumb>`.
 * Displays a YouTube video thumbnail that automatically:
 * - Validates the provided video ID with the YouTube oEmbed API.
 * - Defines boolean-backed resolution attributes (hq, sd, maxres).
 * - Injects the thumbnail template and styles into its shadow root.
 * - Starts and maintains a resolution-aware thumbnail painting loop
 *   that adapts the image to the element's size.
 * @element fttl-yt-thumb
 * @attr {string} video-id - The YouTube video ID to display the thumbnail for.
 * @prop {string} videoId - Getter/setter reflecting the `video-id` attribute.
 * @prop {boolean} hq - Boolean attribute for HQ thumbnail resolution.
 * @prop {boolean} sd - Boolean attribute for SD thumbnail resolution.
 * @prop {boolean} maxres - Boolean attribute for maximum resolution thumbnail.
 * @prop {boolean} noIcon - Boolean attribute for hiding the thumbnail icon.
 * @example
 * ```html
 * <fttl-yt-thumb video-id="dQw4w9WgXcQ"></fttl-yt-thumb>
 * ```
 */
class YouTubeThumbnail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        reflectAttribute(this, VIDEO_ID_ATTR_NAME);
        reflectBooleanAttribute(this, "no-icon");
        defineResolutionAttribute(this);
    }

    /**
     * Handles updates when the `video-id` attribute changes.
     * whenever the `video-id` attribute is updated. It validates the new
     * video ID before re-rendering the component.
     * @param {string} _ - The attribute name (unused, always `"video-id"`).
     * @param {string} oldId - The previous video ID value.
     * @param {string} videoId - The new video ID value.
     * @returns {Promise<void>} Resolves once validation and rendering are complete.
     */
    async attributeChangedCallback(_, oldId, videoId) {
        if (oldId == videoId || !(await httpTestVideoId(videoId))) return;
        render(this);
    }

    static get observedAttributes() {
        return [VIDEO_ID_ATTR_NAME];
    }

    disconnectedCallback() {
        unmapDOM(this);
    }
}

customElements.define(YT_ELEMENT_NAME, YouTubeThumbnail);