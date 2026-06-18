(function() {
    function getQuery() {
        var params = new URLSearchParams(window.location.search);
        return params.get("q") || "";
    }

    function createCard(item) {
        var article = document.createElement("article");
        article.className = "movie-card";
        article.setAttribute("data-title", item.title);
        article.setAttribute("data-region", item.region);
        article.setAttribute("data-year", item.year);
        article.setAttribute("data-genre", item.genre);
        article.setAttribute("data-tags", item.tags);
        article.innerHTML = [
            '<a class="poster-link" href="' + item.link + '">',
            '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy">',
            '<span class="score-badge">' + item.score + '</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<a class="movie-title" href="' + item.link + '">' + item.title + '</a>',
            '<p>' + item.desc + '</p>',
            '<div class="movie-meta"><span>' + item.region + '</span><span>' + item.year + '</span></div>',
            '</div>'
        ].join("");
        return article;
    }

    function render(items) {
        var grid = document.querySelector("[data-search-grid]");
        var empty = document.querySelector("[data-search-empty]");
        if (!grid) {
            return;
        }
        grid.innerHTML = "";
        items.forEach(function(item) {
            grid.appendChild(createCard(item));
        });
        if (empty) {
            empty.classList.toggle("is-visible", items.length === 0);
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        var input = document.querySelector("[data-search-page-input]");
        var form = document.querySelector("[data-search-page-form]");
        var movies = window.SEARCH_MOVIES || [];

        function run(query) {
            var q = (query || "").trim().toLowerCase();
            if (!q) {
                render(movies);
                return;
            }
            render(movies.filter(function(item) {
                return [item.title, item.desc, item.region, item.year, item.genre, item.tags].join(" ").toLowerCase().indexOf(q) !== -1;
            }));
        }

        var initial = getQuery();
        if (input) {
            input.value = initial;
            input.addEventListener("input", function() {
                run(input.value);
            });
        }
        if (form) {
            form.addEventListener("submit", function(event) {
                event.preventDefault();
                run(input ? input.value : "");
            });
        }
        run(initial);
    });
})();
