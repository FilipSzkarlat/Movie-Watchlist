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
  window.location.href.includes("watchlist.html")
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
    if (window.location.href.includes("index.html")) {
      e.target.parentElement.parentElement
        .querySelector(".watchlist-btn")
        .classList.toggle("hidden");
    }
    displayWatchlistMovies();
  }
});

document.addEventListener("storage", () => {
  displayWatchlist.innerHTML = localStorage.getItem("watchlist");
});

// get the movies by clicking the search button
if (window.location.href.includes("index.html")) {
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
    e.target.parentElement.style.display = "none";
    console.log(
      (e.target.parentElement.parentElement.querySelector(
        ".full-plot"
      ).style.display = "block")
    );
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
  console.log(data);
  mainEl.innerHTML = "";
  if (data.Search === undefined) {
    mainEl.innerHTML = `<p>Unable to find what you’re looking for. Please try another search.</p>`;
  } else {
    data.Search.forEach(async (element) => {
      await getMoreInfo(element.imdbID);
      mainEl.innerHTML += `
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
    watchlistArr = JSON.parse(localStorage.getItem("watchlist"));

    displayWatchlist.innerHTML = "";

    watchlistArr.forEach(async (movieId) => {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=9b9e3e76&i=${movieId}`
      );
      const data = await res.json();

      displayWatchlist.innerHTML += `
    <div class="movie" data-id="${data.imdbID}">
      <img class='poster' src="${data.Poster}" alt="${data.Title}" />
      <div class="movie-info">
        <h2>${data.Title}</h2>
        <p class="rating">${data.imdbRating}</p>
        <p class='runtime'>${data.Runtime}</p>
        <p class='genre'>${data.Genre}</p>
        <button class='remove-btn'>
          <img src='img/minus-icon.png'/>
          <p class='padding-left'>Remove</p>
        </button>
      </div>
    </div>`;
    });
  }
}
