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

async function getMovie() {
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
}

// get the more info about the movie using the imdbID
async function getMoreInfo(imdbID) {
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
  }
  