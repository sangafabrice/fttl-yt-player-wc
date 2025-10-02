/**
 * Returns the URL for the specified YouTube video.
 * @param {{videoId: string}} param0 An object containing the YouTube video ID.
 * @returns {string} The full URL of the video.
 * @throws {undefined} Throws undefined if `videoId` is missing.
 */
export default function getVideoUrl({ videoId }) {
    return "https://youtu.be/" + (videoId ?? (() => { throw undefined; })());
}