const searchInput = document.getElementById("search");
const mainEl = document.querySelector("main");
let rating;
let runtime;
let genre;
let plot;
let fullPlot;
let watchlistArr = [];

export async function getMovie() {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=9b9e3e76&plot=&s=${searchInput.value.replace(
        / /g,
        "+"
      )}&`
    );
    const data = await res.json();

    mainEl.innerHTML = "";

    if (data.Search === undefined) {
      mainEl.innerHTML = `<p>Unable to find what you’re looking for. Please try another search.</p>`;
    } else {
      //  Make sure to declare `moviePromises` before using it
      let moviePromises = data.Search.map(async (element) => {
        await getMoreInfo(element.imdbID);
        return `
          <div class="movie" data-id="${element.imdbID}">
              <img class='poster' src="${element.Poster}" alt="${element.Title}" />
              <div class="movie-info">
                  <div class='title'>
                      <h2>${element.Title}</h2>
                      <img src='img/star-icon.png'/>
                      <p class="rating">${rating}</p>
                  </div>
                  <div class='general-info'>
                    <p class='runtime'>${runtime}</p>
                    <p class='genre'>${genre}</p>
                    <button class='watchlist-btn'>
                      <img src='img/plus-icon.png'/>
                      <p class='padding-left'>Watchlist</p>
                    </button>
                    <button class='remove-btn hidden'>
                      <img src='img/minus-icon.png'/>
                      <p class='padding-left'>Remove</p>
                    </button>
                  </div>
                  <div class='more-info'>
                    <p class='plot'>${plot}</p>
                    <p class='full-plot'>${fullPlot}</p>
                  </div>
              </div>
          </div>`;
      });
      //  Use Promise.all to wait for all movie HTML to be ready
      const movieHTMLArray = await Promise.all(moviePromises);
      mainEl.innerHTML = movieHTMLArray.join("");

      //  Ensure watchlist movies have the correct button
      if (localStorage.getItem("watchlist")) {
        checkIfOnTheWatchlistPage();
      }
    }
  } catch (error) {
    console.log("Error fetching movie data:", error);
  }
}

// get the more info about the movie using the imdbID
async function getMoreInfo(imdbID) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=9b9e3e76&i=${imdbID}&`
    );
    const data = await res.json();
    rating = data.imdbRating;
    runtime = data.Runtime;
    genre = data.Genre;
    if (data.Plot.length > 100 && window.innerWidth < 1000) {
      fullPlot = data.Plot;
      data.Plot =
        data.Plot.slice(0, 100) +
        "..." +
        `<span class='read-more-info'>Read more</span>`;
    }
    plot = data.Plot;
  } catch (error) {
    console.log("Error fetching movie data:", error);
  }
}

export function checkIfOnTheWatchlistPage() {
  watchlistArr = JSON.parse(localStorage.getItem("watchlist"));

  mainEl.querySelectorAll(".movie").forEach((movie) => {
    watchlistArr.forEach((movieId) => {
      if (movieId.movieId === movie.dataset.id) {
        movie.querySelector(".watchlist-btn").classList.toggle("hidden");
        movie.querySelector(".remove-btn").classList.toggle("hidden");
      }
    });
  });
}

export function removeMovieFromWatchlist(e) {
  // sync the watchlistArr with the localStorage if there is a watchlist in the localStorage

  watchlistArr = JSON.parse(localStorage.getItem("watchlist"));
  const movieId = e.target.closest(".movie").dataset.id;

  // Remove the movie by filtering out its imdbID

  watchlistArr = watchlistArr.filter((movie) => movie.movieId !== movieId);

  localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

  e.target.parentElement.classList.toggle("hidden");
  e.target.parentElement.parentElement
    .querySelector(".watchlist-btn")
    .classList.toggle("hidden");
}

export function showFullPlot(e) {
  if (e.target.classList.contains("read-more-info")) {
    e.target.parentElement.parentElement.querySelector(
      ".full-plot"
    ).style.display = "block";
    e.target.parentElement.style.display = "none";
  }
}
