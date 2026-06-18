function initMoviePlayer(videoUrl) {
  var video = document.querySelector("[data-player-video]");
  var button = document.querySelector("[data-player-button]");
  if (!video || !button || !videoUrl) {
    return;
  }
  var attached = false;
  var attach = function () {
    if (attached) {
      return;
    }
    attached = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls({ enableWorker: true });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      video._hls = hls;
      return;
    }
    video.src = videoUrl;
  };
  var start = function () {
    attach();
    button.classList.add("is-hidden");
    var playing = video.play();
    if (playing && typeof playing.catch === "function") {
      playing.catch(function () {
        button.classList.remove("is-hidden");
      });
    }
  };
  button.addEventListener("click", start);
  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener("play", function () {
    button.classList.add("is-hidden");
  });
  video.addEventListener("pause", function () {
    if (!video.ended) {
      button.classList.remove("is-hidden");
    }
  });
}
