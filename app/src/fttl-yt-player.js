import style from "./templates/player/player.css.js";
import { mapDOM, unmapDOM } from "./templates/player/player.dom.js";
import { registerOnPlayStartListener, registerOnReadyListener } from "./templates/player/player.event.js";
import { registerPlayOnLoadListener } from "./templates/player/player.event.load.js";
import { render } from "./templates/player/player.html.render.js";
import { renderCurrentTime } from "./templates/player/player.html.time.js";
import { reflectAttribute } from "./utils/reflection.util.js";
import { httpTestVideoId } from "./utils/videoIdValidation.http.js";

/**
 * @module YoutubePlayer
 * 
 * Custom Web Component for embedding and controlling a YouTube video player
 * with extended UI features such as progress bar, mute/unmute, 
 * current time tracking, and accessible controls.
 * ## Usage
 * ```html
 * <fttl-yt-player video-id="dQw4w9WgXcQ"></fttl-yt-player>
 * ```
 * ## Private State
 * - `#href: URL|null` — Cached canonical video URL.
 * - `#duration: number` — Duration of the loaded video.
 * - `#currentTime: number` — Current playback time in seconds.
 * - `#isPlaying: boolean` — Whether the player is currently playing.
 * - `#isMuted: boolean` — Whether the player is muted.
 */

const VIDEO_ID_ATTR_NAME = "video-id";
const YT_ELEMENT_NAME = "fttl-yt-player";

/**
 * Custom element representing a YouTube video player.
 * @extends HTMLElement
 */
class YoutubePlayer extends HTMLElement {
    #href; #duration; #currentTime; #isPlaying; #isMuted; #isRendered = false;

    /**
     * The video title from the embedded YouTube iframe.
     * @readonly
     * @type {string}
     */
    get videoTitle() {
        return mapDOM(this).ytiframe.title;
    }

    /**
     * The canonical URL of the currently loaded video.
     * @readonly
     * @type {string}
     */
    get href() {
        return this.#href.toString();
    }

    /**
     * Creates a new YouTube player element with Shadow DOM and registers
     * playback/ready event listeners to manage state synchronization.
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        reflectAttribute(this, VIDEO_ID_ATTR_NAME);
        this.#resetState();
    }

    /**
     * Called when the element is inserted into the DOM.
     * Registers play-on-load behavior and applies scoped styles.
     */
    connectedCallback() {
        registerPlayOnLoadListener(this);
        style(this);
    }

    /**
     * Called when the observed `video-id` attribute changes.
     * Validates the video ID, then triggers rendering of the UI and player.
     * This callback is self-deleting after the first valid initialization.
     */
    async attributeChangedCallback(_, oldId, videoId) {
        if (oldId == videoId || !(await httpTestVideoId(videoId))) return;
        if (this.#isRendered) {
            this.#resetState();
            registerPlayOnLoadListener(this);
        }
        render(this, url => this.#href = url);
        this.#isRendered = true;
    }

    static get observedAttributes() {
        return [VIDEO_ID_ATTR_NAME];
    }

    disconnectedCallback() {
        unmapDOM(this);
    }

    /**
     * Resets the internal state and DOM of the custom YouTube player element.
     *
     * This method is intended to be called when a new video is loaded or the
     * player needs to be fully re-initialized. It:
     *  - Resets all private properties (#href, #duration, #currentTime, #isPlaying, #isMuted) to their defaults.
     *  - Re-registers listeners for:
     *      - `statechange` (to set `#isPlaying` and update current time).
     *      - `ready` (to capture video duration, seek, and handle mute state).
     *  - Invokes `mapDOM(this)?.derefiframe?.()` to clean up the iframe and reset the shadow DOM if available.
     */
    #resetState() {
        this.#href = null;
        this.#duration = 0;
        this.#currentTime = 0;
        this.#isPlaying = false;
        this.#isMuted = true;
        registerOnPlayStartListener(
            this,
            () => this.#isPlaying = true,
            this.#setCurrentTimeOnTick
        );
        registerOnReadyListener(
            this,
            duration => this.#duration = duration,
            this.#seekOnPlay,
            this.#muteOnPause
        );
        mapDOM(this)?.derefiframe?.();
    }

    /**
     * Handler invoked when playback starts.
     * Unmutes (if not muted), seeks to the current time, and starts playback.
     * @param {YT.Player} ytEmbedPlayer - The YouTube IFrame API player instance.
     * @private
     */
    #seekOnPlay(ytEmbedPlayer) {
        !this.#isMuted && ytEmbedPlayer.unMute();
        ytEmbedPlayer.seekTo(this.#currentTime, true);
        ytEmbedPlayer.playVideo();
        this.#isPlaying = true;
    }

    /**
     * Handler invoked when playback pauses.
     * Updates internal play/pause state and forces mute.
     * @param {YT.Player} ytEmbedPlayer
     * @private
     */
    #muteOnPause(ytEmbedPlayer) {
        this.#isPlaying = false;
        this.#isMuted = ytEmbedPlayer.isMuted();
        ytEmbedPlayer.mute();
    }

    /**
     * Handler invoked on each playback tick (interval).
     * Updates current time and re-renders the progress bar and current time UI.
     * @param {YT.Player} ytEmbedPlayer
     * @private
     */
    #setCurrentTimeOnTick(ytEmbedPlayer) {
        this.#isPlaying &&
        renderCurrentTime(
            this,
            this.#href,
            (this.#currentTime = ytEmbedPlayer.getCurrentTime()),
            this.#duration,
            ytEmbedPlayer.getVideoBytesLoaded()
        );
    }
}

customElements.define(YT_ELEMENT_NAME, YoutubePlayer);