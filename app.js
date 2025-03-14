const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const mainEl = document.querySelector("main");
let rating = "dupa";
let runtime = "dupa";
let genre = "dupa";
let plot = "dupa";
let fullPlot = "dupa";

searchBtn.addEventListener("click", getMovie);
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
                    <p>Watchlist</p>
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
