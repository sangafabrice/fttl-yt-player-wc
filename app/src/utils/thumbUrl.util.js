import Resolution from "./resolution.util.js";

/**
 * Returns the URL of a YouTube video thumbnail for the specified video and resolution.
 * @param {{videoId: string}} param0 An object containing the YouTube video ID.
 * @param {"hq" | "sd" | "maxres"} resolution The resolution of the thumbnail.
 * @returns {string} The full URL of the video thumbnail image.
 * @throws {undefined} Throws undefined if `videoId` is missing or if the resolution is invalid.
 */
export default function getThumbnailUrl({ videoId }, resolution) {
    return Resolution[resolution]
        ? `https://i.ytimg.com/vi/${
            videoId ?? (() => { throw undefined; })()
        }/${resolution}default.jpg`
        : (() => { throw undefined; })();
}