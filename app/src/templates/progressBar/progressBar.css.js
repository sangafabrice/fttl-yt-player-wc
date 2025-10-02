import ShadowCSS from "../../utils/shadowCSS.util.js";
import shadowCssText from "./assets/bin/shadow.min.css";

const VALUE_CSS_VAR = "--value-rate"; // Fill progress (0–1) as a CSS custom property
const BUFFER_CSS_VAR = "--buffer-rate"; // Buffered progress (0–1) as a CSS custom property
export const PROGRESS_DELAY = 1; // seconds

// Base stylesheet shared by all progress bars
const shadowCSS = new ShadowCSS(shadowCssText);

/**
 * Retrieves the inline `style` declaration of the component's
 * shadow stylesheet. This allows dynamic updates to CSS custom
 * properties that control the progress bar fill and buffer.
 * @param {HTMLElement} progressBar - The custom progress bar element.
 * @returns {CSSStyleDeclaration} The modifiable inline style rule.
 */
export function getInlineStyle(progressBar) {
    return progressBar.shadowRoot.adoptedStyleSheets[1].cssRules[0].style;
}

/**
 * Attaches stylesheets to the progress bar's shadow DOM:
 * - `shadowCSS`: The shared base stylesheet imported from `shadow.css`.
 * - `embedCSS`: A component-specific stylesheet containing inline rules.
 * @param {HTMLElement} progressBar - The custom progress bar element.
 */
export function style(progressBar) {
    const embedCSS = Object.freeze(new CSSStyleSheet);
    embedCSS.insertRule(":host{}");
    shadowCSS.style(progressBar, embedCSS);
}

/**
 * Updates the visual fill of the progress bar by setting
 * the `--value-rate` CSS custom property.
 * @param {HTMLElement} progressBar - The custom progress bar element.
 * @param {number} rate - Fill progress as a decimal (0.0–1.0).
 */
export function updateFillBar(progressBar, rate) {
    getInlineStyle(progressBar).setProperty(VALUE_CSS_VAR, Number(rate));
}

/**
 * Updates the buffered portion of the progress bar by setting
 * the `--loaded-rate` CSS custom property.
 * @param {HTMLElement} progressBar - The custom progress bar element.
 * @param {number} rate - Buffered progress as a decimal (0.0–1.0).
 */
export function updateBufferBar(progressBar, rate) {
    getInlineStyle(progressBar).setProperty(BUFFER_CSS_VAR, Number(rate));
}