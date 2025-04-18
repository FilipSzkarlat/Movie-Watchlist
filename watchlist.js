const mainEl = document.querySelector("main");
const displayWatchlist = document.getElementById("display-watchlist");
let rating = "dupa";
let runtime = "dupa";
let genre = "dupa";
let plot = "dupa";
let fullPlot = "dupa";
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
  // sync the watchlistArr with the localStorage if there is a watchlist in the localStorage

  if (e.target.parentElement.classList.contains("remove-btn")) {
    watchlistArr = JSON.parse(localStorage.getItem("watchlist"));
    const movieId = e.target.closest(".movie").dataset.id;

    // Remove the movie by filtering out its imdbID
    watchlistArr = watchlistArr.filter((id) => id !== movieId);

    localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

    e.target.parentElement.classList.toggle("hidden");

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

    watchlistArr.forEach(async (movieId) => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=9b9e3e76&i=${movieId}`
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
      } catch (err) {
        console.error("Error fetching movie data:", err);
      }
    });
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
  } catch (err) {
    console.error("Error fetching movie data:", err);
  }
}

async function getTheFullPlot(imdbID) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=9b9e3e76&i=${imdbID}&`
    );
    const data = await res.json();
    console.log(data);
    fullPlot = data.Plot;
    return fullPlot;
  } catch (err) {
    console.error("Error fetching movie data:", err);
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
