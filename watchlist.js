import {
  checkIfOnTheWatchlistPage,
  removeMovieFromWatchlist,
} from "./renderMovie.js";

const mainEl = document.querySelector("main");
const displayWatchlist = document.getElementById("display-watchlist");
let watchlistArr = [];

if (localStorage.getItem("watchlist")) {
  // display the movies from the watchlist
  displayWatchlistMovies();
}

if (localStorage.getItem("watchlist") === "[]") {
  displayWatchlist.innerHTML = `<p>Your watchlist is looking a little empty...</p>
    <a href="index.html" class="add-movie-btn">
      <img class="icon" src="img/plus-icon.png" alt="simple plus icon" />
      <p>Let's add some movies!</p>
    </a>`;
}

// remove movie from watchlist
mainEl.addEventListener("click", (e) => {
  if (e.target.parentElement.classList.contains("remove-btn")) {
    removeMovieFromWatchlist(e);
    // remove the movie from the watchlist without reloading the page
    e.target.parentElement.parentElement.parentElement.parentElement.remove();
  }
});

function displayWatchlistMovies() {
  // check if the watchlist is empty
  if (localStorage.getItem("watchlist") === "[]") {
    mainEl.innerHTML = `<p>Your watchlist is looking a little empty...</p>
        <a href="index.html" class="add-movie-btn">
          <img class="icon" src="img/plus-icon.png" alt="simple plus icon" />
          <p>Let's add some movies!</p>
        </a>`;
  } else {
    // display the movies from the watchlist
    watchlistArr = JSON.parse(localStorage.getItem("watchlist"));

    displayWatchlist.innerHTML = "";

    watchlistArr.forEach((movie) => {
      displayWatchlist.innerHTML += movie.content;
    });
    checkIfOnTheWatchlistPage();
  }
}

// show the full plot of the movie by clicking the read more button
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("read-more-info")) {
    e.target.parentElement.parentElement.querySelector(
      ".full-plot"
    ).style.display = "block";
    e.target.parentElement.style.display = "none";
  }
});
