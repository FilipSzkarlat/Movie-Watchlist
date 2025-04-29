import { getMovie, removeMovieFromWatchlist } from "./renderMovie.js";

const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const mainEl = document.querySelector("main");
let watchlistArr = [];

// get the movies by clicking the search button
searchBtn.addEventListener("click", getMovie);
// get the movies by pressing the enter key
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getMovie();
  }
});

// add movie to watchlist
mainEl.addEventListener("click", (e) => {
  // sync the watchlistArr with the localStorage if there is a watchlist in the localStorage
  if (localStorage.getItem("watchlist")) {
    watchlistArr = JSON.parse(localStorage.getItem("watchlist"));
  }

  // add the movie to the watchlist by clicking the watchlist button
  if (e.target.parentElement.classList.contains("watchlist-btn")) {
    const movieId = e.target.closest(".movie").dataset.id; // Get imdbID
    const movie = e.target.closest(".movie").outerHTML; // Get the movie HTML
    // add the movie to the watchlist array
    if (!watchlistArr.includes(movieId) && watchlistArr !== null) {
      const myObject = { movieId: movieId, content: movie };
      watchlistArr.push(myObject);
    } else if (e.target.parentElement.classList.contains("remove-btn")) {
      removeMovieFromWatchlist(e);
    }

    // show the full plot of the movie by clicking the read more button
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("read-more-info")) {
        console.log(
          e.target.parentElement.parentElement.querySelector(".full-plot")
        );
        e.target.parentElement.parentElement.querySelector(
          ".full-plot"
        ).style.display = "block";
        e.target.parentElement.style.display = "none";
      }
    });

    // save the watchlist array to the localStorage
    localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

    e.target.parentElement.classList.toggle("hidden");
    e.target.parentElement.parentElement
      .querySelector(".remove-btn")
      .classList.toggle("hidden");
  }
});
