/**
 * General-purpose memoizer that caches results of any function.
 * - Ensures the function has (or gets) a `.cache` Map property.
 * - Returns the cached result if available, otherwise computes,
 *   caches, and returns the result of `functionFn(cacheKey)`.
 * @template G, T
 * @param {function(G): T & {cache?: Map<G, T>}} functionFn
 *   Any pure function that can be memoized. A `.cache` property
 *   will be attached automatically if not present.
 * @param {G} cacheKey
 *   The input argument used as the key in the memoization cache.
 * @returns {T}
 *   The cached or newly computed result.
 */
export default function memoize(functionFn, cacheKey) {
    functionFn.cache?.constructor === Map || (functionFn.cache = new Map);
    return (
        functionFn.cache.get(cacheKey) ??
        functionFn.cache.set(cacheKey, functionFn(cacheKey)).get(cacheKey)
    );
}