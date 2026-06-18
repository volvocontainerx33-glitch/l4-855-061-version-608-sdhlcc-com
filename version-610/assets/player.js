(function() {
    function loadHls(callback) {
        if (window.Hls) {
            callback();
            return;
        }
        var script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js";
        script.onload = callback;
        document.head.appendChild(script);
    }

    function attach(video, url, onReady) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            onReady();
            return;
        }
        loadHls(function() {
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, onReady);
            }
        });
    }

    function init(box) {
        var video = box.querySelector("video");
        var button = box.querySelector(".play-cover");
        if (!video || !button) {
            return;
        }
        var stream = video.getAttribute("data-stream");
        var loaded = false;

        function play() {
            button.classList.add("is-hidden");
            video.controls = true;
            if (!loaded) {
                loaded = true;
                attach(video, stream, function() {
                    video.play().catch(function() {});
                });
                return;
            }
            video.play().catch(function() {});
        }

        button.addEventListener("click", play);
        video.addEventListener("click", function() {
            if (video.paused) {
                play();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function() {
        Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(init);
    });
})();
