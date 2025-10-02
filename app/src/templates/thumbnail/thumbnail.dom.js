import ShadowDOMMap from "../../utils/domMap.util.js";
import parseHTML from "../../utils/parseHTML.util.js";
import shadowDOMHtml from "./assets/bin/template.min.html";
import playButtonImage from "./assets/yt-play-icon.svg";

const shadowDOM = parseHTML(shadowDOMHtml);
shadowDOM.querySelector("slot").insertAdjacentHTML("afterend", playButtonImage);

/**
 * Maps DOM references inside the cloned Shadow DOM to
 * named properties for easier access in the thumbnail logic.
 * @param {DocumentFragment} shadowDOM The cloned Shadow DOM template.
 * @returns {{style: HTMLStyleElement}} Mapped DOM references.
 */
function getShadowDOMMap (shadowDOM) {
    return { style: shadowDOM.firstElementChild }
}

// Destructure the bound `mapDOM`, `unmapDOM`, and render functions from a new ShadowDOMMap
// instance, so they can be used directly without losing `this` context.
const { mapDOM, unmapDOM, renderDOM } = ShadowDOMMap.create(shadowDOM, getShadowDOMMap);

export { mapDOM, unmapDOM, renderDOM };