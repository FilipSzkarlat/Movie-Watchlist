const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const mainEl = document.querySelector("main");
const displayWatchlist = document.getElementById("display-watchlist");
let rating = "dupa";
let runtime = "dupa";
let genre = "dupa";
let plot = "dupa";
let fullPlot = "dupa";
let watchlistArr = [];

// check if there is a watchlist in the localStorage and if the user is on the watchlist page
if (
  localStorage.getItem("watchlist") &&
  window.location.href.includes("watchlist")
) {
  // display the movies from the watchlist
  displayWatchlistMovies();
}
// add movie to watchlist
mainEl.addEventListener("click", (e) => {
  // sync the watchlistArr with the localStorage if there is a watchlist in the localStorage
  if (localStorage.getItem("watchlist")) {
    watchlistArr = JSON.parse(localStorage.getItem("watchlist"));
  }

  // add the movie to the watchlist by clicking the watchlist button
  if (e.target.parentElement.classList.contains("watchlist-btn")) {
    const movieId = e.target.closest(".movie").dataset.id; // Get imdbID
    // add the movie to the watchlist array
    if (!watchlistArr.includes(movieId)) {
      watchlistArr.push(movieId);
    }

    // save the watchlist array to the localStorage
    localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

    e.target.parentElement.classList.toggle("hidden");
    e.target.parentElement.parentElement
      .querySelector(".remove-btn")
      .classList.toggle("hidden");
  }
});

document.addEventListener("storage", () => {
  displayWatchlist.innerHTML = localStorage.getItem("watchlist");
});

// remove movie from watchlist
mainEl.addEventListener("click", (e) => {
  // sync the watchlistArr with the localStorage if there is a watchlist in the localStorage
  if (localStorage.getItem("watchlist")) {
    watchlistArr = JSON.parse(localStorage.getItem("watchlist"));
  }
  if (e.target.parentElement.classList.contains("remove-btn")) {
    const movieId = e.target.closest(".movie").dataset.id;

    // Remove the movie by filtering out its imdbID
    watchlistArr = watchlistArr.filter((id) => id !== movieId);

    localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

    e.target.parentElement.classList.toggle("hidden");
    if (!window.location.href.includes("watchlist")) {
      e.target.parentElement.parentElement
        .querySelector(".watchlist-btn")
        .classList.toggle("hidden");
    }
    // remove the movie from the watchlist without reloading the page
    if (window.location.href.includes("watchlist")) {
      e.target.parentElement.parentElement.parentElement.parentElement.remove();
    }
  }
});

document.addEventListener("storage", () => {
  displayWatchlist.innerHTML = localStorage.getItem("watchlist");
});

// get the movies by clicking the search button
if (!window.location.href.includes("watchlist")) {
  searchBtn.addEventListener("click", getMovie);
  // get the movies by pressing the enter key
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      getMovie();
    }
  });
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("read-more-info")) {
    e.target.parentElement.innerHTML = fullPlot;
  }
});

async function getMovie() {
  const res = await fetch(
    `http://www.omdbapi.com/?apikey=9b9e3e76&plot=&s=${searchInput.value.replace(
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
    checkIfOnTheWatchlistPage();
  }
}

// get the more info about the movie using the imdbID
async function getMoreInfo(imdbID) {
  const res = await fetch(
    `http://www.omdbapi.com/?apikey=9b9e3e76&i=${imdbID}&`
  );
  const data = await res.json();
  console.log(data);
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
}

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

    watchlistArr.forEach(async (movieId) => {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=9b9e3e76&i=${movieId}`
      );
      const data = await res.json();
      await getMoreInfo(movieId);

      displayWatchlist.innerHTML += `
        <div class="movie" data-id="${data.imdbID}">
            <img class='poster' src="${data.Poster}" alt="${data.Title}" />
            <div class="movie-info">
                <div class='title'>
                    <h2>${data.Title}</h2>
                    <img src='img/star-icon.png'/>
                    <p class="rating">${rating}</p>
                </div>
                <div class='general-info'>
                  <p class='runtime'>${runtime}</p>
                  <p class='genre'>${genre}</p>
                  <button class='watchlist-btn hidden'>
                    <img src='img/plus-icon.png'/>
                    <p class='padding-left'>Watchlist</p>
                  </button>
                  <button class='remove-btn'>
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
  }
}

function checkIfOnTheWatchlistPage() {
  watchlistArr = JSON.parse(localStorage.getItem("watchlist"));

  mainEl.querySelectorAll(".movie").forEach((movie) => {
    if (watchlistArr.includes(movie.dataset.id)) {
      movie.querySelector(".watchlist-btn").classList.toggle("hidden");
      movie.querySelector(".remove-btn").classList.toggle("hidden");
    }
  });
}

async function getTheFullPlot(imdbID) {
  const res = await fetch(
    `http://www.omdbapi.com/?apikey=9b9e3e76&i=${imdbID}&`
  );
  const data = await res.json();
  console.log(data);
  fullPlot = data.Plot;
  return fullPlot;
}
