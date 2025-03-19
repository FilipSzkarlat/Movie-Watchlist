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
  window.location.href === "http://127.0.0.1:5500/watchlist.html"
) {
  // get the watchlist array from the localStorage
  watchlistArr = JSON.parse(localStorage.getItem("watchlist"));
  // display the watchlist
  displayWatchlist.innerHTML = "";
  watchlistArr.forEach((element) => {
    displayWatchlist.innerHTML += element;
  });
}

// add movie to watchlist
mainEl.addEventListener("click", (e) => {
  // sync the watchlistArr with the localStorage if there is a watchlist in the localStorage
  if (localStorage.getItem("watchlist")) {
    watchlistArr = JSON.parse(localStorage.getItem("watchlist"));
  }

  // add the movie to the watchlist by clicking the watchlist button
  if (e.target.parentElement.classList.contains("watchlist-btn")) {
    // add the movie to the watchlist array
    console.log(
      e.target.parentElement.parentElement.parentElement.parentElement.innerHTML
    );
    watchlistArr.push(
      e.target.parentElement.parentElement.parentElement.parentElement.innerHTML
    );
    // save the watchlist array to the localStorage
    localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

    e.target.parentElement.parentElement.parentElement.classList.toggle(
      "watchlist"
    );
  }
});
document.addEventListener("storage", () => {
  displayWatchlist.innerHTML = localStorage.getItem("watchlist");
});

// get the movies by clicking the search button
searchBtn.addEventListener("click", getMovie);
// get the movies by pressing the enter key
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getMovie();
  }
});

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
  data.Search.forEach(async (element) => {
    await getMoreInfo(element.imdbID);
    mainEl.innerHTML += `
        <div class="movie">
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
                </div>
                <div class='more-info'>
                  <p class='plot'>${plot}</p>
                  <p class='full-plot'>${fullPlot}</p>
                </div>
                
            </div>
        </div>`;
  });
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
