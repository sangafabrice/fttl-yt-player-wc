import getHttpCachedValue from "./_memo.http.js";
import getThumbnailUrl from "./thumbUrl.util.js";

/**
 * fetches a thumbnail URL and returns it as a blob URL.
 * @param {string} thumbnailUrl The URL of the thumbnail image.
 * @returns {Promise<string>} A promise that resolves to a blob URL.
 * @throws {null} Throws null if the HTTP response is not OK.
 * @private
 */
async function httpRequestThumbnail(thumbnailUrl) {
    return fetch(thumbnailUrl)
        .then(response => {
            if (!response.ok) throw null;
            return response.blob();
        })
        .then(URL.createObjectURL);
}

/**
 * Requests a YouTube video thumbnail and caches the result.
 * This function forwards its arguments to `getThumbnailUrl`, so parameters are the same.
 * @see getThumbnailUrl
 * @returns {Promise<string>} A promise resolving to the blob URL of the thumbnail.
 * @throws {undefined} Throws undefined  when the navigator is offline.
 */
export default async function () {
    return getHttpCachedValue(
        httpRequestThumbnail,
        getThumbnailUrl(...arguments),
        () => { throw undefined; }
    );
}