suite("video id setup", async function () {
    await customElements.whenDefined("fttl-yt-player");
    const player = document.querySelector("fttl-yt-player");

    test("video id is set", function () {
        assert.equal(player.videoId, "ZmRLA3vYXhU");
    });
});