const eventDefaultSettings = { bubbles: true, composed: true };

/**
 * Dispatches a `"ready"` event when the YouTube IFrame player is initialized.
 * @param {{ target: YT.Player }} param0 The YouTube player event object with a `target` property.
 * @this {HTMLIFrameElement} The custom element (or host) dispatching the event.
 * @fires ready
 */
export function dispatchOnReady ({ target: player }) {
    /**
     * Fired when the YouTube IFrame player is ready.
     * @event ready
     * @type {CustomEvent}
     * @property {function(): void} destroy Seek to a given time in the video.
     * @property {number} duration The total duration of the video in seconds.
     * @property {function(number, boolean=): void} seekTo Seek to a given time in the video.
     * @property {function(): void} playVideo Start video playback.
     * @property {function(): void} pauseVideo Pause video playback.
     * @property {function(): void} mute Mute the video.
     * @property {function(): void} unMute Unmute the video.
     * @property {function(): boolean} isMuted Checks if the player volume is 0 (true if muted, false otherwise).
     * @property {string} href The canonical video URL.
     * @property {string} title The video title.
     */
    this.dispatchEvent(new CustomEvent("ready", {
        ...eventDefaultSettings,
        detail: {
            destroy: player.destroy.bind(player),
            duration: player.getDuration(),
            seekTo: player.seekTo.bind(player),
            playVideo: player.playVideo.bind(player),
            pauseVideo: player.pauseVideo.bind(player),
            mute: player.setVolume.bind(player, 0), // Mute by setting volume to 0
            unMute: player.setVolume.bind(player, 100), // Unmute by setting volume to 100
            isMuted: () => player.getVolume() === 0, // Returns true if volume is 0
            href: player.getVideoUrl(),
            title: player.videoTitle
        }
    }));
}

/**
 * Dispatches a `statechange` event when the YouTube IFrame player changes state.
 * @param {{ target: YT.Player, data: number }} param0 
 *   - `target`: The YouTube player instance.  
 *   - `data`: The player state (e.g. `YT.PlayerState.PLAYING`).
 * @this {HTMLIFrameElement} The custom element (or host) dispatching the event.
 * @fires statechange
 */
export function dispatchOnStateChange ({ target: player, data }) {
    /**
     * Fired when the YouTube IFrame player state changes.
     * @event statechange
     * @type {CustomEvent}
     * @property {function(): void} playVideo Start video playback.
     * @property {function(): number} getCurrentTime Get the current playback time in seconds.
     * @property {boolean} isPlaying Whether the video is currently playing.
     * @property {function(): number} getVideoBytesLoaded Get the number of video bytes loaded.
     * A number between 0 and 1 representing the fraction of the video data that has been loaded.
     */
    this.dispatchEvent(new CustomEvent("statechange", {
        ...eventDefaultSettings,
        detail: {
            videoId: player.getVideoData().video_id,
            playVideo: player.playVideo.bind(player),
            getCurrentTime: player.getCurrentTime.bind(player),
            isPlaying: data == YT.PlayerState.PLAYING,
            getVideoBytesLoaded: player.getVideoBytesLoaded.bind(player)
        }
    }));
}