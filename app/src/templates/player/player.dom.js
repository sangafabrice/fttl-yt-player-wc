import "../../fttl-yt-thumb.js";
import "../../fttl-progress-bar.js";
import ytIFrame from "../ytIFrame/ytIFrame.js";
import ShadowDOMMap from "../../utils/domMap.util.js";
import parseHTML from "../../utils/parseHTML.util.js";
import shadowDOMHtml from "./assets/bin/template.min.html";
import volumeTitleSvg from "./assets/volume-title.svg";
import volumeMuteSvg from "./assets/volume-mute.svg";
import volumeUpSvg from "./assets/volume-up.svg";

await customElements.whenDefined("fttl-yt-thumb");
await customElements.whenDefined("fttl-progress-bar");

const shadowDOM = parseHTML(shadowDOMHtml);
shadowDOM.querySelector("button").innerHTML =
    volumeTitleSvg + volumeUpSvg + volumeMuteSvg;

/**
 * Maps DOM references inside the cloned Shadow DOM to
 * named properties for easier access in the player logic.
 * @param {DocumentFragment} shadowDOM The cloned Shadow DOM template.
 * @returns {{
 *   thumbnail: YouTubeThumbnail,
 *   progressBar: ProgressBar,
 *   ytiframe: HTMLIFrameElement,
 *   soundButton: HTMLButtonElement,
 *   timer: HTMLTimeElement,
 *   timerSROnly: HTMLSpanElement,
 *   timerDisplay: HTMLSpanElement,
 *   anchor: HTMLAnchorElement
 * }} Mapped DOM references.
 */
function getShadowDOMMap(shadowDOM) {
    return {
        thumbnail: shadowDOM.querySelector("fttl-yt-thumb"),
        progressBar: shadowDOM.querySelector("fttl-progress-bar"),
        beforeIframe: shadowDOM.querySelector("iframe").previousElementSibling,
        ytiframe: ytIFrame.create(shadowDOM.querySelector("iframe")),
        soundButton: shadowDOM.querySelector("button"),
        timer: shadowDOM.querySelector("time"),
        timerSROnly: shadowDOM.querySelector("span.sr-only"),
        timerDisplay: shadowDOM.querySelector("span[aria-hidden]"),
        anchor: shadowDOM.querySelector("a")
    };
}

// Destructure the bound `mapDOM` and `unmapDOM` functions from a new ShadowDOMMap
// instance, so they can be used directly without losing `this` context.
const { mapDOM, unmapDOM, renderDOM } = ShadowDOMMap.create(shadowDOM, getShadowDOMMap);

export { mapDOM, unmapDOM, renderDOM };

/**
 * Resets the shadow DOM of the YouTube player component.
 * This function restores the iframe and resets player-related UI state
 * (timer, anchor, accessible SR-only text). It re-clones the iframe from
 * a template and re-initializes the mapped DOM structure.
 * @function resetDOM
 * @param {YouTubePlayer} ytPlayer - The custom `<fttl-yt-player>` element whose DOM should be reset.
 */
export function resetDOM(ytPlayer) {
    const dom = mapDOM(ytPlayer);
    const newIframe = shadowDOM.querySelector("iframe").cloneNode(true);
    dom.ytiframe = ytIFrame.create(dom.beforeIframe.insertAdjacentElement("afterend", newIframe));
    const { timerDisplay, timerSROnly, timer, anchor } = dom;
    delete timerDisplay.dataset.duration;
    delete timerDisplay.dataset.currentTime;
    timerSROnly.innerHTML = "";
    timer.removeAttribute("datetime");
    anchor.innerHTML = "";
    anchor.removeAttribute("href");
}