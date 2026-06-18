
(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        startTimer();
      });
    }

    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    show(0);
    startTimer();
  });

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function filterScope(scope) {
    var input = scope.querySelector('[data-card-search]');
    var year = scope.querySelector('[data-year-filter]');
    var region = scope.querySelector('[data-region-filter]');
    var category = scope.querySelector('[data-category-filter]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.search-card'));
    var empty = scope.querySelector('[data-empty-state]');
    var query = normalize(input ? input.value : '');
    var yearValue = normalize(year ? year.value : '');
    var regionValue = normalize(region ? region.value : '');
    var categoryValue = normalize(category ? category.value : '');
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var cardYear = normalize(card.getAttribute('data-year'));
      var cardRegion = normalize(card.getAttribute('data-region'));
      var cardCategory = normalize(card.getAttribute('data-category'));
      var matched = true;

      if (query && text.indexOf(query) === -1) {
        matched = false;
      }
      if (yearValue && cardYear !== yearValue) {
        matched = false;
      }
      if (regionValue && cardRegion !== regionValue) {
        matched = false;
      }
      if (categoryValue && cardCategory !== categoryValue) {
        matched = false;
      }

      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var controls = scope.querySelectorAll('[data-card-search], [data-year-filter], [data-region-filter], [data-category-filter]');
    controls.forEach(function (control) {
      control.addEventListener('input', function () {
        filterScope(scope);
      });
      control.addEventListener('change', function () {
        filterScope(scope);
      });
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    var input = scope.querySelector('[data-card-search]');
    if (q && input) {
      input.value = q;
    }
    filterScope(scope);
  });
}());
