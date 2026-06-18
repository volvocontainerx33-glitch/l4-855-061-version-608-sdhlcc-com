(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('open');
        document.body.classList.toggle('menu-open', menu.classList.contains('open'));
      });
    }

    queryAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var value = input ? input.value.trim() : '';
        var target = './search.html';
        if (value) {
          target += '?q=' + encodeURIComponent(value);
        }
        window.location.href = target;
      });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = queryAll('[data-hero-slide]', hero);
      var dots = queryAll('[data-hero-dot]', hero);
      var activeIndex = 0;
      var timer = null;
      var showSlide = function (index) {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, current) {
          slide.classList.toggle('active', current === activeIndex);
        });
        dots.forEach(function (dot, current) {
          dot.classList.toggle('active', current === activeIndex);
        });
      };
      var play = function () {
        clearInterval(timer);
        timer = setInterval(function () {
          showSlide(activeIndex + 1);
        }, 5200);
      };
      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          showSlide(index);
          play();
        });
      });
      if (slides.length > 1) {
        play();
      }
    }

    var searchPage = document.querySelector('[data-search-page]');
    var searchInput = document.querySelector('[data-search-input]');
    if (searchPage && searchInput) {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q') || '';
      searchInput.value = initial;
    }

    var runFilter = function (scope, value) {
      var term = (value || '').trim().toLowerCase();
      var cards = queryAll('.movie-card', scope);
      var visible = 0;
      cards.forEach(function (card) {
        var title = (card.getAttribute('data-title') || '').toLowerCase();
        var meta = (card.getAttribute('data-meta') || '').toLowerCase();
        var text = title + ' ' + meta;
        var match = !term || text.indexOf(term) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) {
          visible += 1;
        }
      });
      var empty = scope.querySelector('[data-empty-state]');
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    };

    queryAll('[data-card-filter]').forEach(function (input) {
      var scope = input.closest('.filter-scope') || document;
      var listScope = document.querySelector('[data-card-list]') || scope;
      input.addEventListener('input', function () {
        runFilter(listScope, input.value);
      });
    });

    if (searchInput) {
      var pageScope = document.querySelector('[data-card-list]') || document;
      runFilter(pageScope, searchInput.value);
      searchInput.addEventListener('input', function () {
        runFilter(pageScope, searchInput.value);
      });
      queryAll('[data-filter-chip]').forEach(function (chip) {
        chip.addEventListener('click', function () {
          var value = chip.getAttribute('data-filter-chip') || '';
          searchInput.value = value;
          runFilter(pageScope, value);
        });
      });
    }

    var shell = document.querySelector('.player-shell');
    if (shell) {
      var video = shell.querySelector('video');
      var trigger = shell.querySelector('.play-trigger');
      var stream = shell.getAttribute('data-stream');
      var hlsInstance = null;
      var started = false;
      var startPlayback = function () {
        if (!video || !stream) {
          return;
        }
        if (!started) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
          } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hlsInstance.loadSource(stream);
            hlsInstance.attachMedia(video);
          } else {
            video.src = stream;
          }
          video.controls = true;
          started = true;
        }
        shell.classList.add('is-playing');
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      };
      if (trigger) {
        trigger.addEventListener('click', startPlayback);
      }
      video.addEventListener('click', function () {
        if (!started) {
          startPlayback();
        }
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  });
})();
