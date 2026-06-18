(function () {
  function setMessage(player, message) {
    var target = player.querySelector('[data-player-message]');

    if (target) {
      target.textContent = message || '';
    }
  }

  function playVideo(video) {
    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        setMessage(video.closest('[data-player]'), '播放已就绪，请再次点击视频控件开始播放。');
      });
    }
  }

  function initPlayer(player) {
    var button = player.querySelector('[data-player-button]');
    var video = player.querySelector('video');
    var source = player.getAttribute('data-src');
    var hlsInstance = null;

    if (!button || !video || !source) {
      return;
    }

    button.addEventListener('click', function () {
      button.classList.add('is-hidden');
      setMessage(player, '正在加载视频...');

      if (window.Hls && window.Hls.isSupported()) {
        if (hlsInstance) {
          hlsInstance.destroy();
        }

        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setMessage(player, '');
          playVideo(video);
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setMessage(player, '视频加载失败，请刷新页面后重试。');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          setMessage(player, '');
          playVideo(video);
        }, { once: true });
      } else {
        setMessage(player, '当前浏览器暂不支持此播放格式。');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initPlayer);
  });
})();
