(function () {
  var navButton = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length > 1) {
    var active = 0;
    var showSlide = function (index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
      });
    });
    setInterval(function () {
      showSlide(active + 1);
    }, 5600);
  }

  var pageInput = document.getElementById('pageSearch');
  if (pageInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
    var filterCards = function () {
      var q = pageInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var hay = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
        card.classList.toggle('is-hidden', q && hay.indexOf(q) === -1);
      });
    };
    pageInput.addEventListener('input', filterCards);
    var pageForm = pageInput.closest('form');
    if (pageForm) {
      pageForm.addEventListener('submit', function (event) {
        event.preventDefault();
        filterCards();
      });
    }
  }

  var siteInput = document.getElementById('siteSearch');
  var results = document.getElementById('searchResults');
  if (siteInput && results && Array.isArray(window.SEARCH_ITEMS)) {
    var renderResults = function () {
      var q = siteInput.value.trim().toLowerCase();
      results.innerHTML = '';
      if (!q) {
        results.classList.remove('is-active');
        return;
      }
      var matches = window.SEARCH_ITEMS.filter(function (item) {
        return item.q.indexOf(q) !== -1;
      }).slice(0, 18);
      matches.forEach(function (item) {
        var link = document.createElement('a');
        link.className = 'search-result-item';
        link.href = item.url;
        link.innerHTML = '<strong>' + item.title + '</strong><span>' + item.meta + '</span>';
        results.appendChild(link);
      });
      if (!matches.length) {
        var empty = document.createElement('div');
        empty.className = 'search-result-item';
        empty.textContent = '未找到匹配影片';
        results.appendChild(empty);
      }
      results.classList.add('is-active');
    };
    siteInput.addEventListener('input', renderResults);
    var siteForm = siteInput.closest('form');
    if (siteForm) {
      siteForm.addEventListener('submit', function (event) {
        event.preventDefault();
        renderResults();
      });
    }
  }
}());
