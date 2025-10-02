import getHttpCachedValue from "./_memo.http.js";
import getVideoUrl from "./videoUrl.util.js";

/**
 * Validates a YouTube video ID by sending a HEAD request to the oEmbed endpoint.
 * @param {string} videoId The YouTube video ID to validate.
 * @returns {Promise<boolean>} A promise resolving to true if the video exists, false otherwise.
 * @private
 */
async function httpTestVideoId(videoId) {
    return fetch(
        `https://www.youtube.com/oembed?url=${getVideoUrl({
            videoId
        })}&format=json`,
        { method: "HEAD" }
    ).then(({ ok }) => ok);
}

/**
 * Checks if a YouTube video ID is valid (matches the pattern and exists on YouTube).
 * @param {string} videoId The YouTube video ID to check.
 * @returns {Promise<boolean>} True if the ID is valid and the video exists, false otherwise.
 */
export default async function (videoId) {
    return /^[a-zA-Z0-9_-]{11}$/.test(videoId)
        ? getHttpCachedValue(httpTestVideoId, videoId)
        : false;
}