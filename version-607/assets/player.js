(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function playVideo(video) {
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }

  function attachPlayer(shell) {
    var video = shell.querySelector("video");
    var stream = shell.getAttribute("data-stream");
    if (!video || !stream) {
      return;
    }
    if (video.getAttribute("data-ready") !== "true") {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        video._hlsPlayer = hls;
      } else {
        video.src = stream;
      }
      video.setAttribute("data-ready", "true");
    }
    shell.classList.add("is-started");
    playVideo(video);
  }

  ready(function () {
    document.querySelectorAll(".player-shell").forEach(function (shell) {
      var overlay = shell.querySelector(".play-overlay");
      var video = shell.querySelector("video");
      if (overlay) {
        overlay.addEventListener("click", function () {
          attachPlayer(shell);
        });
      }
      if (video) {
        video.addEventListener("click", function () {
          if (video.getAttribute("data-ready") !== "true") {
            attachPlayer(shell);
          }
        });
      }
    });
  });
})();
