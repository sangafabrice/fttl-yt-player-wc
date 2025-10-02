/**
 * A utility class for mapping cloned Shadow DOM templates to custom elements.
 * This class maintains an internal {@link WeakMap} that associates each
 * HTMLElement with a cloned copy of a provided template and a mapped set
 * of DOM references defined by a user-supplied mapping function.
 * @template T The shape of the object returned by the `templateMapFn`.
 */
export default class ShadowDOMMap {
    /** @type {WeakMap<HTMLElement, T & {template: DocumentFragment, deref: () => void}>} */
    #domMapper = new WeakMap;

    /** @type {(template: DocumentFragment) => T} */
    #templateMapFn;

    /** @type {DocumentFragment} */
    #shadowDOM;

    /**
     * @param {DocumentFragment} shadowDOM The shadow DOM template to clone for each element.
     * @param {(template: DocumentFragment) => T} templateMapFn A function that maps DOM references from the cloned template.
     */
    constructor(shadowDOM, templateMapFn) {
        this.#shadowDOM = shadowDOM;
        this.#templateMapFn = templateMapFn;
    }

    /**
     * Returns the mapped DOM references for a custom element.
     * If not already mapped, a clone of the template is created,
     * passed through `templateMapFn`, and stored in the internal WeakMap.
     * @param {HTMLElement} customElement The custom element for which to retrieve the mapped DOM.
     * @returns {T & {template: DocumentFragment, deref: () => void}} The mapped DOM references.
     * @remarks
     * - The `deref` method removes the reference to the `template`.
     */
    mapDOM(customElement) {
        return (
            this.#domMapper.get(customElement) ??
            this.#domMapper
                .set(
                    customElement,
                    (template => ({
                        template,
                        ...this.#templateMapFn(template),
                        deref: function () {
                            delete this.template;
                        },
                    }))(this.#shadowDOM.cloneNode(true))
                )
                .get(customElement)
        );
    }

    /**
     * Removes the DOM mapping associated with the specified element.
     * @param {HTMLElement} customElement The element whose mapping should be removed.
     */
    unmapDOM(customElement) {
        this.#domMapper.delete(customElement);
    }

    /**
     * Renders the Shadow DOM template into the given custom element.
     * @param {HTMLElement} customElement The custom element to render into.
     * @remarks
     * This method will skip rendering if the shadow root already has children.
     */
    renderDOM(customElement) {
        if (customElement.shadowRoot.hasChildNodes()) return;
        const dom = this.mapDOM(customElement);
        customElement.shadowRoot.appendChild(dom.template);
        dom.deref();
    }

    /**
     * Factory method that creates a new {@link ShadowDOMMap} instance
     * and returns only its bound public API methods (`mapDOM`, `unmapDOM`).
     * This is useful if you don’t need to keep the full class instance
     * and just want the mapping functions.
     * @template T
     * @param {DocumentFragment} shadowDOM The shadow DOM template to clone for each element.
     * @param {(template: DocumentFragment) => T} templateMapFn A function that maps DOM references from the cloned template.
     * @returns {{
     *   mapDOM(customElement: HTMLElement): T & {template: DocumentFragment, deref: () => void},
     *   unmapDOM(customElement: HTMLElement): void,
     *   renderDOM(customElement: HTMLElement): void
     * }}
     */
    static create() {
        const shadowDOMMap = new ShadowDOMMap(...arguments);
        return {
            mapDOM: shadowDOMMap.mapDOM.bind(shadowDOMMap),
            unmapDOM: shadowDOMMap.unmapDOM.bind(shadowDOMMap),
            renderDOM: shadowDOMMap.renderDOM.bind(shadowDOMMap),
        };
    }
}
