/**
 * Converts an HTML attribute name (kebab-case) to a JS property name (camelCase).
 * Example: "video-id" -> "videoId"
 * @param {string} attributeName - The attribute name to convert.
 * @returns {string} The converted camelCase property name.
 */
function convertToPropertyName(attributeName) {
    return attributeName
        .toLowerCase()
        .replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Reflects a string-valued HTML attribute as a JavaScript property
 * on a custom element. The property is named using camelCase, derived
 * from the attribute name.
 * @param {HTMLElement} customElement - The custom element to define the property on.
 * @param {string} attributeName - The name of the attribute to reflect.
 * @example
 * const el = document.createElement("div");
 * reflectAttribute(el, "video-id");
 * el.videoId = "abc123";          // sets the "video-id" attribute
 * console.log(el.getAttribute("video-id")); // "abc123"
 */
export function reflectAttribute(customElement, attributeName) {
    Object.defineProperty(customElement, convertToPropertyName(attributeName), {
        get: function () {
            return customElement.getAttribute(attributeName);
        },
        set: function (value) {
            customElement.setAttribute(attributeName, value);
        },
    })
}

/**
 * Reflects a boolean HTML attribute as a JavaScript property
 * on a custom element. The property is named using camelCase, derived
 * from the attribute name.
 * @param {HTMLElement} customElement - The custom element to define the property on.
 * @param {string} attributeName - The name of the boolean attribute to reflect.
 * @throws {Error} If the property is set to a non-boolean value.
 * @example
 * const el = document.createElement("div");
 * reflectBooleanAttribute(el, "no-icon");
 * el.noIcon = true;     // adds the "no-icon" attribute
 * console.log(el.hasAttribute("no-icon")); // true
 * el.noIcon = false;    // removes the "no-icon" attribute
 * console.log(el.hasAttribute("no-icon")); // false
 */
export function reflectBooleanAttribute(customElement, attributeName) {
    Object.defineProperty(customElement, convertToPropertyName(attributeName), {
        get: function () {
            return customElement.hasAttribute(attributeName);
        },
        set: function (value) {
            if (typeof value != "boolean")
                throw Error(`boolean value expected in ${attributeName}`);
            value
                ? customElement.setAttribute(attributeName, "")
                : customElement.removeAttribute(attributeName);
        },
    });
}
