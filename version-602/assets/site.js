(function () {
  var ready = function (fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  };

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    var carousel = document.querySelector("[data-carousel]");
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
      var next = carousel.querySelector("[data-hero-next]");
      var prev = carousel.querySelector("[data-hero-prev]");
      var index = 0;
      var timer = null;
      var show = function (target) {
        if (!slides.length) {
          return;
        }
        index = (target + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      };
      var restart = function () {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5000);
      };
      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          restart();
        });
      }
      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          restart();
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot") || 0));
          restart();
        });
      });
      restart();
    }

    var params = new URLSearchParams(window.location.search);
    var queryValue = params.get("q") || "";
    var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-card-search]"));
    searchInputs.forEach(function (input) {
      if (queryValue && !input.value) {
        input.value = queryValue;
      }
    });

    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-search-panel], [data-filter-form]"));
    var filterAll = function () {
      var textInput = document.querySelector("[data-card-search]");
      var typeFilter = document.querySelector("[data-type-filter]");
      var regionFilter = document.querySelector("[data-region-filter]");
      var yearFilter = document.querySelector("[data-year-filter]");
      var query = textInput ? textInput.value.trim().toLowerCase() : "";
      var type = typeFilter ? typeFilter.value : "";
      var region = regionFilter ? regionFilter.value : "";
      var year = yearFilter ? yearFilter.value : "";
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card-list] [data-title]"));
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
        var ok = true;
        if (query && haystack.indexOf(query) === -1) {
          ok = false;
        }
        if (type && card.getAttribute("data-type") !== type) {
          ok = false;
        }
        if (region && card.getAttribute("data-region") !== region) {
          ok = false;
        }
        if (year && card.getAttribute("data-year") !== year) {
          ok = false;
        }
        card.hidden = !ok;
      });
    };

    panels.forEach(function (panel) {
      panel.addEventListener("submit", function (event) {
        event.preventDefault();
        filterAll();
      });
      panel.addEventListener("input", filterAll);
      panel.addEventListener("change", filterAll);
    });

    if (queryValue) {
      filterAll();
    }
  });
})();
