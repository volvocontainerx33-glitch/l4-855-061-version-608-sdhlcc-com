(() => {
  const by = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initMenu() {
    const toggle = by("[data-menu-toggle]");
    const menu = by("[data-mobile-menu]");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      menu.classList.toggle("is-open");
    });
  }

  function initHero() {
    const hero = by("[data-hero]");
    if (!hero) return;
    const slides = all("[data-hero-slide]", hero);
    const dots = all("[data-hero-dot]", hero);
    const prev = by("[data-hero-prev]", hero);
    const next = by("[data-hero-next]", hero);
    if (!slides.length) return;
    let index = 0;
    let timer = null;

    const show = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => show(index + 1), 5200);
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        show(Number(dot.dataset.heroDot || 0));
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", () => {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  function initFilters() {
    all("[data-filter-scope]").forEach((scope) => {
      const cards = all("[data-movie-card]", scope);
      const search = by("[data-filter-search]", scope);
      const type = by("[data-filter-type]", scope);
      const year = by("[data-filter-year]", scope);
      const genre = by("[data-filter-genre]", scope);
      const empty = by("[data-empty-state]", scope);

      const read = (field) => (field ? field.value.trim().toLowerCase() : "");

      const apply = () => {
        const q = read(search);
        const t = read(type);
        const y = read(year);
        const g = read(genre);
        let visible = 0;

        cards.forEach((card) => {
          const text = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre
          ].join(" ").toLowerCase();
          const okSearch = !q || text.includes(q);
          const okType = !t || String(card.dataset.type || "").toLowerCase() === t;
          const okYear = !y || String(card.dataset.year || "").toLowerCase() === y;
          const okGenre = !g || String(card.dataset.genre || "").toLowerCase().includes(g);
          const show = okSearch && okType && okYear && okGenre;
          card.hidden = !show;
          if (show) visible += 1;
        });

        if (empty) empty.classList.toggle("is-visible", visible === 0);
      };

      [search, type, year, genre].forEach((field) => {
        if (field) field.addEventListener("input", apply);
        if (field) field.addEventListener("change", apply);
      });
    });
  }

  function initPlayers() {
    all("[data-player]").forEach((shell) => {
      const video = by("video[data-stream]", shell);
      const trigger = by("[data-play-trigger]", shell);
      if (!video) return;
      let hls = null;
      let started = false;

      const reveal = () => {
        if (trigger) trigger.classList.add("is-hidden");
      };

      const playVideo = () => {
        const url = video.dataset.stream;
        if (!url) return;
        reveal();
        if (!started) {
          started = true;
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            video.load();
            video.play().catch(() => {});
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
              video.play().catch(() => {});
            });
          } else {
            video.src = url;
            video.load();
            video.play().catch(() => {});
          }
        } else {
          video.play().catch(() => {});
        }
      };

      shell.addEventListener("click", (event) => {
        const onTrigger = event.target.closest("[data-play-trigger]");
        if (onTrigger || event.target === video || event.target === shell) {
          playVideo();
        }
      });

      video.addEventListener("play", reveal);
      window.addEventListener("pagehide", () => {
        if (hls) hls.destroy();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
