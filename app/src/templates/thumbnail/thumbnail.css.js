import { mapDOM } from "./thumbnail.dom.js";
import getThumbnailUrl from "../../utils/thumbUrl.util.js";
import Resolution from "../../utils/resolution.util.js";
import shadowCssText from "./assets/bin/shadow.min.css";

const THUMBNAIL_URL_CSS_VAR_PREFIX = "--yt-thumbnail-url-";

/**
 * Builds the CSS selector for a given resolution attribute.
 * @param {string} resolution - The resolution key (from {@link Resolution}).
 * @returns {string} A selector targeting the host element with the given resolution attribute.
 * @private
 */
function getResolutionCSSSelector(resolution) {
    return `:host([${resolution}])`;
}

/**
 * Waits until a `style` element has an attached stylesheet.
 * This is necessary because the `sheet` property is `null` immediately after
 * setting `textContent`.
 * @param {{ style: HTMLStyleElement }} param0 - Object containing a style element.
 * @returns {Promise<void>} A promise that resolves once the `sheet` is available.
 * @private
 */
function waitCSSSheet({ style }) {
    const doWhile = resolve => {
        if (!style.sheet) return setTimeout(doWhile, 0, resolve);
        resolve();
    };
    return new Promise(doWhile);
}

/**
 * Initializes the style element in the shadow DOM of a YouTube thumbnail component.
 * It generates a block of CSS rules for each resolution defined in `Resolution`.
 * For all resolutions except `Resolution.maxres`, the function sets a custom CSS
 * property (`--yt-thumbnail-url-<resolution>`) pointing to the corresponding thumbnail URL.
 * @param {YouTubeThumbnail} ytThumb - The custom thumbnail element.
 */
function initStyle(ytThumb) {
    mapDOM(ytThumb).style.textContent = Object.keys(Resolution).reduce(
        (styleText, res) =>
            styleText +
            getResolutionCSSSelector(res) +
            `{${
                res != Resolution.maxres
                    ? `${THUMBNAIL_URL_CSS_VAR_PREFIX + res}:` +
                      `url(${getThumbnailUrl(ytThumb, res)})`
                    : ""
            }}`,
        shadowCssText
    );
}

/**
 * Updates the thumbnail CSS rules inside the shadow DOM of a custom element.
 * For each resolution except `Resolution.maxres`, the CSS variable
 * `--yt-thumbnail-url-<resolution>` is updated to reflect the new thumbnail URL.
 * For `Resolution.maxres`, the corresponding CSS variable is removed.
 * @param {YouTubeThumbnail} ytThumb - The custom thumbnail element.
 */
function updateStyle(ytThumb) {
    Object.keys(Resolution).forEach(async res => {
        if (res != Resolution.maxres)
            return setThumbnail(
                await getResolutionCSSRule(ytThumb, res),
                res,
                getThumbnailUrl(ytThumb, res)
            );
        (await getResolutionCSSRule(ytThumb, res)).style.removeProperty(
            THUMBNAIL_URL_CSS_VAR_PREFIX + res
        );
    });
}

/**
 * Ensures that the shadow DOM of a custom thumbnail element has
 * up-to-date CSS rules for YouTube thumbnails.
 * - If no styles have been injected yet, it initializes them.
 * - If styles already exist, it updates them with the latest URLs.
 * @param {YouTubeThumbnail} ytThumb - The custom thumbnail element.
 */
export function style(ytThumb) {
    mapDOM(ytThumb).style.textContent.length === 0
        ? initStyle(ytThumb)
        : updateStyle(ytThumb);
}

/**
 * Retrieves the CSS rule associated with a specific resolution for a given thumbnail.
 * This waits until the style element's `sheet` is available before resolving.
 * @param {YouTubeThumbnail} ytThumb - The custom thumbnail element.
 * @param {string} resolution - The resolution key (from {@link Resolution}).
 * @returns {Promise<CSSStyleRule|undefined>} A promise resolving to the CSS rule,
 * or `undefined` if not found.
 */
export async function getResolutionCSSRule(ytThumb, resolution) {
    await waitCSSSheet(mapDOM(ytThumb));
    return [...(mapDOM(ytThumb).style.sheet?.cssRules ?? [])].filter(
        ({ selectorText }) => selectorText?.startsWith(getResolutionCSSSelector(resolution))
    )[0];
}

/**
 * Updates the CSS custom property for a given resolution to point to a new blob URL.
 * This allows dynamically swapping out the thumbnail image without regenerating CSS.
 * @param {{ style: CSSStyleDeclaration }} param0 - Object containing the element's `style`.
 * @param {string} resolution - The resolution key (from {@link Resolution}).
 * @param {string} url - The URL for the image.
 */
export function setThumbnail({ style }, resolution, url) {
    style.setProperty(THUMBNAIL_URL_CSS_VAR_PREFIX + resolution, `url(${url})`);
}

/**
 * Appends a CSS rule to the given stylesheet that sets the
 * `--yt-thumbnail-url-previous` custom property on the host element.
 * This allows the component to remember or display the "previous" thumbnail
 * by binding a blob URL to the CSS variable.
 * @param {YouTubeThumbnail} ytThumb - The custom thumbnail element.
 * @param {string} blobUrl - A blob URL pointing to an image resource.
 */
export function appendPrevThumb(ytThumb, blobUrl) {
    const { sheet } = mapDOM(ytThumb).style;
    sheet.insertRule(
        `#host{${THUMBNAIL_URL_CSS_VAR_PREFIX}previous:url(${blobUrl})}`,
        sheet.cssRules.length
    );
}