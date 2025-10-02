/**
 * Parses an HTML string containing a `<template>` element
 * and returns its `DocumentFragment` content.
 * @param {string} htmlTemplateString - The HTML string containing a `<template>` element.
 * @returns {DocumentFragment} The content of the parsed template.
 * @throws {Error} If no `<template>` element is found in the HTML string.
 * @example
 * const html = `<template><div class="card">Hello</div></template>`;
 * const fragment = parseHTML(html);
 * document.body.appendChild(fragment.cloneNode(true));
 * // → Appends <div class="card">Hello</div> to the body
 */
export default function parseHTML(htmlTemplateString) {
    return Object.freeze(
        new DOMParser()
            .parseFromString(htmlTemplateString, "text/html")
            .querySelector("template").content
    );
}
