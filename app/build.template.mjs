/**
 * Build script to minify template assets (`shadow.css` and `template.html`)
 * located under `src\templates\**\assets\`.
 * - CSS files are processed with PostCSS, using:
 * - `postcss-preset-env` (polyfills modern CSS features)
 * - `cssnano` (minifies CSS output)
 * - HTML files are minified using `html-minifier-terser`.
 * Minified files are written alongside the originals in a `bin/` subdirectory,
 * with filenames suffixed as `.min.css` and `.min.html`.
 * Example:
 * src/templates/my-component/assets/shadow.css → src/templates/my-component/assets/bin/shadow.min.css
 * src/templates/my-component/assets/template.html → src/templates/my-component/assets/bin/template.min.html
 */
import postcss from "postcss";
import presetEnv from "postcss-preset-env";
import cssnano from "cssnano";
import { minify } from "html-minifier-terser";
import fs from "fs";
import path from "path";
import fg from "fast-glob";

// Glob all shadow.css and template.html files inside assets
const templates = fg.sync(
    ["shadow.css", "template.html"].map(
        scriptName => "src/templates/**/assets/" + scriptName
    )
);

// PostCSS processor with preset-env and cssnano
const processor = postcss([presetEnv, cssnano]);

// Iterate over each template and generate a minified copy in bin/
for (const template of templates) {
    const outDir = path.join(path.dirname(template), "bin");
    const minScriptName = path.basename(template).replace(/(\.[^\.]+)$/g, ".min$1");
    const minTemplate = path.join(outDir, minScriptName);
    fs.mkdirSync(outDir, { recursive: true });
    const templateContent = fs.readFileSync(template, { encoding: "utf8" });
    const minContent = await minifyContent(templateContent, path.extname(template));
    fs.writeFileSync(minTemplate, minContent);
}

/**
 * Dispatches to the appropriate minifier based on file extension.
 * @param {string} content - Raw file contents.
 * @param {string} extname - File extension (".css" or ".html").
 * @returns {Promise<string>} Minified file contents.
 */
async function minifyContent(content, extname) {
    switch (extname) {
        case ".css": return minifyCSS(content);
        case ".html": return minifyHTML(content);
    }
}

/**
 * Minify CSS content using PostCSS with `preset-env` and `cssnano`.
 * @param {string} css - Raw CSS content.
 * @returns {Promise<string>} Minified CSS.
 */
async function minifyCSS(css) {
    return processor.process(css).async().then(({ css }) => css);
}

/**
 * Minify HTML content using `html-minifier-terser`.
 * @param {string} html - Raw HTML content.
 * @returns {Promise<string>} Minified HTML.
 */
async function minifyHTML(html) {
    return minify(html, { collapseWhitespace: true });
}