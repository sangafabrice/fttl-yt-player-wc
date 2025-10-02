export default function onReady(progressBar) {
    return new Promise(resolve => {
        (function doWhile() {
            if (progressBar.isConnected) resolve();
            setTimeout(doWhile, 0);
        })();
    });
}