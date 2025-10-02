await customElements.whenDefined("fttl-yt-player");
const createPlayer = document.createElement.bind(document, "fttl-yt-player");
// set the video id attribute before connecting
const player = createPlayer();
player.videoId = "sMCaKQPtokc";
document.body.appendChild(player);
// set the video id attribute after connecting
document.body.appendChild(createPlayer()).videoId = "mQiXwd-PDVo";