/**
 * Memoizes the values returned by the specified function.
 * The function should define a `cache` property, which is a Map used to store memoized values.
 * @template G, T=boolean
 * @param {function(G): T & {cache: Map<G, T>}} httpRequestFn The HTTP request function whose return values are memoized.
 * @param {G} cacheKey The unique argument used to identify and memoize the result.
 * @param {function(?G=): T} [onOfflineCb] Optional function to call when the navigator is offline.
 * @returns {T} The memoized value.
 */
export default function (httpRequestFn, cacheKey, onOfflineCb) {
    // TODO: Handle the cases where `httpRequestFn.cache` is and object or constant
    httpRequestFn.cache?.constructor === Map ||
        (httpRequestFn.cache = new Map);
    return (
        httpRequestFn.cache.get(cacheKey) ??
        (navigator.onLine
            ? httpRequestFn.cache
                  .set(cacheKey, httpRequestFn(cacheKey))
                  .get(cacheKey)
            : onOfflineCb?.(cacheKey) ?? false)
    );
}