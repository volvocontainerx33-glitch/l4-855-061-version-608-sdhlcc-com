(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMobileMenu() {
    document.querySelectorAll("[data-menu-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        var panel = document.getElementById(button.getAttribute("data-menu-toggle"));
        if (panel) {
          panel.classList.toggle("open");
        }
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-slide]"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide")) || 0);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function setSearchInputsFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    if (!query) {
      return;
    }
    document.querySelectorAll("[data-main-search], [data-list-search]").forEach(function (input) {
      input.value = query;
    });
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupFilters() {
    var grids = Array.prototype.slice.call(document.querySelectorAll(".movie-grid"));
    grids.forEach(function (grid) {
      var wrapper = grid.closest(".section-wrap") || document;
      var input = wrapper.querySelector("[data-list-search]");
      var chips = Array.prototype.slice.call(wrapper.querySelectorAll(".filter-chip"));
      var activeFilter = "all";
      function applyFilter() {
        var query = normalize(input ? input.value : "");
        var token = normalize(activeFilter);
        Array.prototype.slice.call(grid.querySelectorAll(".movie-card")).forEach(function (card) {
          var text = normalize(card.getAttribute("data-filter-text"));
          var matchesQuery = !query || text.indexOf(query) !== -1;
          var matchesToken = token === "all" || text.indexOf(token) !== -1;
          card.classList.toggle("hidden", !(matchesQuery && matchesToken));
        });
      }
      if (input) {
        input.addEventListener("input", applyFilter);
      }
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chips.forEach(function (item) {
            item.classList.remove("active");
          });
          chip.classList.add("active");
          activeFilter = chip.getAttribute("data-filter") || "all";
          applyFilter();
        });
      });
      applyFilter();
    });
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setSearchInputsFromQuery();
    setupFilters();
  });
})();
