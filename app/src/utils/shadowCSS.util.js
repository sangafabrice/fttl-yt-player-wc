/**
 * Utility class for managing reusable shadow DOM styles.
 * `ShadowCSS` wraps a `CSSStyleSheet` and provides a method for applying
 * it to the `adoptedStyleSheets` of a custom element’s shadow root.
 * @example
 * import ShadowCSS from "./ShadowCSS.js";
 *
 * // Create reusable stylesheet
 * const theme = new ShadowCSS(`
 *   :host {
 *     display: block;
 *     background: black;
 *     color: yellow;
 *   }
 * `);
 *
 * class MyElement extends HTMLElement {
 *   constructor() {
 *     super();
 *     this.attachShadow({ mode: "open" });
 *     theme.style(this);
 *   }
 * }
 * customElements.define("my-element", MyElement);
 */
export default class ShadowCSS {
    #sheet = new CSSStyleSheet;

    /**
     * Creates a frozen `CSSStyleSheet` and populates it with the given CSS text.
     * @param {string} cssText - The CSS rules to initialize the stylesheet with.
     */
    constructor(cssText) {
        Object.freeze(this.#sheet).replace(cssText);
    }

    /**
     * Applies the internal stylesheet (and any additional stylesheets) to
     * the shadow root of the specified element.
     * @param {HTMLElement} customElement - The element whose shadow root will adopt the styles.
     * @param {...CSSStyleSheet} additionalSheets - Extra stylesheets to append after the internal one.
     */
    style(customElement, ...additionalSheets) {
        customElement.shadowRoot.adoptedStyleSheets.push(this.#sheet, ...additionalSheets);
    }

    /**
     * Factory method that returns an object exposing only the bound `style` method.
     * Useful for when you want to expose styling functionality without
     * exposing the class internals.
     * @param {string} cssText - The CSS rules to initialize the stylesheet with.
     * @returns {{style(customElement: HTMLElement, ...additionalSheets: CSSStyleSheet[]): void}}
     * @example
     * const { style } = ShadowCSS.create(":host { color: blue; }");
     * // Later in a custom element:
     * style(this);
     */
    static create() {
        const shadowCSS = new ShadowCSS(...arguments);
        return { style: shadowCSS.style.bind(shadowCSS) };
    }
}