/**
 * Dynamically loads the YouTube IFrame API and resolves when it is ready.
 * @module ytIFrameApiReady
 * @returns {Promise<boolean>} A promise that resolves with `true` once the
 * YouTube IFrame API is ready for use.
 */

const script = document.body.appendChild(
    Object.assign(document.createElement("script"), {
        async: true,
        src: "https://www.youtube.com/iframe_api",
    })
);

export default Object.freeze(
    new Promise(function (resolve) {
        window.onYouTubeIframeAPIReady = () => {
            delete window.onYouTubeIframeAPIReady;
            script.remove();
            resolve(true);
        };
    })
);