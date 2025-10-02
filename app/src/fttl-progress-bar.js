import onReady from "./templates/progressBar/progressBar.event.js";
import memoize from "./utils/memo.util.js";
import { reflectAttribute } from "./utils/reflection.util.js";
import { style, updateBufferBar, updateFillBar } from "./templates/progressBar/progressBar.css";

const VALUE_ATTR_NAME = "value";
const BUFFER_ATTR_NAME = "buffer";
const ELEMENT_NAME = "fttl-progress-bar";

/**
 * `<fttl-progress-bar>`
 * A custom web component that renders a progress bar with two layers:
 * - **Fill bar**: controlled via the `value` attribute.
 * - **Buffer bar**: controlled via the `buffer` attribute.
 * The attributes are automatically reflected as properties, meaning:
 * ```js
 * progressBar.value = 0.5;
 * progressBar.buffer = 0.75;
 * ```
 * will update the CSS variables and therefore the rendered bar.
 * @property {number} value  A rate between 0 and 1 representing the filled portion of the bar.
 * @property {number} buffer A rate between 0 and 1 representing the buffered portion of the bar.
 * @example
 * const progress = document.createElement("fttl-progress-bar");
 * document.body.appendChild(progress);
 * progress.value = 0.4;  // 40% filled
 * progress.buffer = 0.7; // 70% buffered
 */
class ProgressBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        reflectAttribute(this, VALUE_ATTR_NAME);
        reflectAttribute(this, BUFFER_ATTR_NAME);
    }

    connectedCallback() {
        style(this);
    }

    async attributeChangedCallback(attrName, oldValue, value) {
        if (isNaN(value) || Number(oldValue) == Number(value)) return;
        await memoize(onReady, this);
        attrName == VALUE_ATTR_NAME
            ? updateFillBar(this, value)
            : updateBufferBar(this, value);
    }

    static get observedAttributes() {
        return [VALUE_ATTR_NAME, BUFFER_ATTR_NAME];
    }
}

customElements.define(ELEMENT_NAME, ProgressBar);