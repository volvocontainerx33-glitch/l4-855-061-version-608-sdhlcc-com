(function() {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function() {
        var navButton = document.querySelector("[data-nav-toggle]");
        var navMenu = document.querySelector("[data-nav-menu]");
        if (navButton && navMenu) {
            navButton.addEventListener("click", function() {
                navMenu.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startHero() {
            if (timer || slides.length < 2) {
                return;
            }
            timer = window.setInterval(function() {
                showSlide(current + 1);
            }, 5200);
        }

        function stopHero() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener("click", function() {
                stopHero();
                showSlide(index);
                startHero();
            });
        });

        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        if (prev) {
            prev.addEventListener("click", function() {
                stopHero();
                showSlide(current - 1);
                startHero();
            });
        }
        if (next) {
            next.addEventListener("click", function() {
                stopHero();
                showSlide(current + 1);
                startHero();
            });
        }
        showSlide(0);
        startHero();

        var filterForms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        filterForms.forEach(function(panel) {
            var input = panel.querySelector("[data-filter-input]");
            var genre = panel.querySelector("[data-filter-genre]");
            var year = panel.querySelector("[data-filter-year]");
            var reset = panel.querySelector("[data-filter-reset]");
            var scope = document.querySelector(panel.getAttribute("data-filter-panel"));
            var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll(".movie-card")) : [];
            var empty = document.querySelector(panel.getAttribute("data-empty-target"));

            function applyFilter() {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var genreValue = genre ? genre.value : "";
                var yearValue = year ? year.value : "";
                var visible = 0;
                cards.forEach(function(card) {
                    var haystack = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags")
                    ].join(" ").toLowerCase();
                    var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                    var okGenre = !genreValue || haystack.indexOf(genreValue.toLowerCase()) !== -1;
                    var okYear = !yearValue || card.getAttribute("data-year") === yearValue;
                    var visibleNow = okKeyword && okGenre && okYear;
                    card.style.display = visibleNow ? "" : "none";
                    if (visibleNow) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [input, genre, year].forEach(function(element) {
                if (element) {
                    element.addEventListener("input", applyFilter);
                    element.addEventListener("change", applyFilter);
                }
            });
            if (reset) {
                reset.addEventListener("click", function() {
                    if (input) {
                        input.value = "";
                    }
                    if (genre) {
                        genre.value = "";
                    }
                    if (year) {
                        year.value = "";
                    }
                    applyFilter();
                });
            }
            applyFilter();
        });
    });
})();
