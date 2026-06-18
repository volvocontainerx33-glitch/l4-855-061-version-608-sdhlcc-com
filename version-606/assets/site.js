(function () {
  "use strict";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initMobileMenu() {
    var button = $("[data-menu-button]");
    var menu = $("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }

    button.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function initHero() {
    var root = $("[data-hero-carousel]");
    if (!root) {
      return;
    }

    var slides = $all("[data-hero-slide]", root);
    var dots = $all("[data-hero-dot]", root);
    var prev = $("[data-hero-prev]", root);
    var next = $("[data-hero-next]", root);
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("is-active", idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("is-active", idx === current);
        dot.setAttribute("aria-current", idx === current ? "true" : "false");
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () {
        show(idx);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initCategoryFilter() {
    var input = $("[data-category-filter]");
    if (!input) {
      return;
    }

    var cards = $all("[data-filter-card]");
    input.addEventListener("input", function () {
      var keyword = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = (card.getAttribute("data-filter-card") || "").toLowerCase();
        card.style.display = !keyword || haystack.indexOf(keyword) !== -1 ? "" : "none";
      });
    });
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span class="tag">' + escapeHtml(tag) + '</span>';
    }).join("");

    return [
      '<a class="movie-card" href="' + escapeHtml(movie.detail_url) + '">',
      '  <div class="card-media">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="card-gradient"></span>',
      '    <span class="card-badge">' + escapeHtml(movie.region) + '</span>',
      '    <span class="card-genre">' + escapeHtml(movie.genre_raw) + '</span>',
      '  </div>',
      '  <div class="card-body">',
      '    <h3 class="card-title">' + escapeHtml(movie.title) + '</h3>',
      '    <p class="card-desc">' + escapeHtml(movie.one_line) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '    <div class="card-footer">',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '    </div>',
      '  </div>',
      '</a>'
    ].join("");
  }

  function initSearchPage() {
    var results = $("[data-search-results]");
    var keywordInput = $("[data-search-keyword]");
    if (!results || !keywordInput || !window.MOVIES) {
      return;
    }

    var regionSelect = $("[data-search-region]");
    var typeSelect = $("[data-search-type]");
    var yearSelect = $("[data-search-year]");
    var summary = $("[data-search-summary]");
    var params = new URLSearchParams(window.location.search);
    var initialKeyword = params.get("q") || "";
    keywordInput.value = initialKeyword;

    function fillSelect(select, values, label) {
      if (!select) {
        return;
      }
      select.innerHTML = '<option value="">' + label + '</option>' + values.map(function (value) {
        return '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + '</option>';
      }).join("");
    }

    function uniqueValues(key) {
      var set = new Set();
      window.MOVIES.forEach(function (movie) {
        if (movie[key]) {
          set.add(movie[key]);
        }
      });
      return Array.from(set).sort(function (a, b) {
        return String(b).localeCompare(String(a), "zh-CN");
      });
    }

    fillSelect(regionSelect, uniqueValues("region"), "全部地区");
    fillSelect(typeSelect, uniqueValues("type"), "全部类型");
    fillSelect(yearSelect, uniqueValues("year"), "全部年份");

    function runSearch() {
      var keyword = keywordInput.value.trim().toLowerCase();
      var region = regionSelect ? regionSelect.value : "";
      var type = typeSelect ? typeSelect.value : "";
      var year = yearSelect ? yearSelect.value : "";

      var matched = window.MOVIES.filter(function (movie) {
        var text = [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre_raw,
          (movie.tags || []).join(" "),
          movie.one_line
        ].join(" ").toLowerCase();

        return (!keyword || text.indexOf(keyword) !== -1) &&
          (!region || movie.region === region) &&
          (!type || movie.type === type) &&
          (!year || movie.year === year);
      }).slice(0, 160);

      if (summary) {
        summary.textContent = "共找到 " + matched.length + " 条结果" + (keyword ? "，关键词：" + keywordInput.value.trim() : "");
      }

      if (!matched.length) {
        results.innerHTML = '<div class="no-results panel">没有找到匹配影片，请尝试更换关键词或筛选条件。</div>';
        return;
      }

      results.innerHTML = matched.map(movieCard).join("");
    }

    [keywordInput, regionSelect, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", runSearch);
        control.addEventListener("change", runSearch);
      }
    });

    runSearch();
  }

  function initPlayers() {
    $all("[data-player]").forEach(function (shell) {
      var video = $("video", shell);
      var overlay = $("[data-play-overlay]", shell);
      var message = $("[data-player-message]", shell);
      var src = shell.getAttribute("data-video-src");

      if (!video || !src) {
        return;
      }

      function showMessage(text) {
        if (message) {
          message.textContent = text;
          message.classList.add("is-visible");
        }
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage("当前网络或播放源暂时不可用，请稍后重试。");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        showMessage("当前浏览器不支持 HLS 播放，请使用最新版 Safari、Chrome、Edge 或 Firefox 访问。");
      }

      if (overlay) {
        overlay.addEventListener("click", function () {
          video.play().catch(function () {
            showMessage("浏览器阻止了自动播放，请再次点击播放器开始播放。");
          });
        });
      }

      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });

      video.addEventListener("pause", function () {
        if (overlay && !video.ended) {
          overlay.classList.remove("is-hidden");
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initHero();
    initCategoryFilter();
    initSearchPage();
    initPlayers();
  });
})();
