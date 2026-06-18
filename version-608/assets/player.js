(function () {
  var box = document.querySelector('.player-box');
  if (!box) {
    return;
  }
  var video = box.querySelector('video');
  var button = box.querySelector('.play-cover');
  var stream = box.getAttribute('data-stream');
  var started = false;
  var hlsInstance = null;

  var setMessage = function (text) {
    if (button) {
      var strong = button.querySelector('strong');
      if (strong) {
        strong.textContent = text;
      }
    }
  };

  var attachStream = function () {
    if (!video || !stream) {
      setMessage('暂不可播放');
      return Promise.reject(new Error('empty'));
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return Promise.resolve();
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      }
      return Promise.resolve();
    }
    video.src = stream;
    return Promise.resolve();
  };

  var start = function () {
    if (started) {
      return;
    }
    started = true;
    setMessage('正在播放');
    attachStream().then(function () {
      var playTask = video.play();
      if (playTask && typeof playTask.then === 'function') {
        playTask.then(function () {
          box.classList.add('is-playing');
        }).catch(function () {
          started = false;
          setMessage('点击继续播放');
        });
      } else {
        box.classList.add('is-playing');
      }
    }).catch(function () {
      started = false;
      setMessage('暂不可播放');
    });
  };

  if (button) {
    button.addEventListener('click', start);
  }
  box.addEventListener('click', function (event) {
    if (event.target === video && started) {
      return;
    }
    if (!started) {
      start();
    }
  });
}());
