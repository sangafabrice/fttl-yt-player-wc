import Resolution from "../../utils/resolution.util.js";
import { renderDOM } from "./thumbnail.dom.js";
import { style } from "./thumbnail.css.js";
import { reflectBooleanAttribute } from "../../utils/reflection.util.js";
import setThumbnailOnResize from "./thumbnail.event.js";

/**
 * Clears all resolution state flags on the thumbnail element.
 * Each resolution key in {@link Resolution} is reset to `false`.
 * @param {YouTubeThumbnail} ytThumb - The thumbnail element to reset.
 * @private
 */
function clearResolutionAttributes(ytThumb) {
    Object.keys(Resolution).forEach(res => ytThumb[res] = false);
}

/**
 * Renders the thumbnail element.
 * - Clears resolution state flags.
 * - Delegates DOM rendering to {@link renderDOM}.
 * @param {YouTubeThumbnail} ytThumb - The thumbnail element to render.
 */
export function render(ytThumb) {
    clearResolutionAttributes(ytThumb);
    style(ytThumb);
    renderDOM(ytThumb);
    setThumbnailOnResize(ytThumb);
}

/**
 * Defines boolean-backed resolution properties on the thumbnail element.
 * For each key in {@link Resolution}, a property is defined on the element:
 * - **Getter**: Returns `true` if the element has the corresponding attribute.
 * - **Setter**: Adds or removes the attribute when set to `true` or `false`.
 *   Throws an `Error` if a non-boolean value is assigned.
 * @param {YouTubeThumbnail} ytThumb - The thumbnail element to augment with resolution properties.
 * @example
 * defineResolutionAttribute(ytThumb);
 * ytThumb.hq = true;   // Adds the "hq" attribute
 * console.log(ytThumb.hq); // true
 * ytThumb.hq = false;  // Removes the "hq" attribute
 */
export function defineResolutionAttribute(ytThumb) {
    Object.keys(Resolution).forEach(reflectBooleanAttribute.bind(null, ytThumb));
}