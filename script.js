// refactor
const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", async function () {
  try {
    const search = document.querySelector(".search");
    const movies = await getMovies(search.value);
    moviesUI(movies);
  } catch (err) {
    console.log(err);
    let alertEl = "";
    const alertBox = document.querySelector(".alert");
    alertEl += `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>${err.title}!!! </strong>${err.kosong}.
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`;

    alertBox.innerHTML = alertEl;
    let content = document.querySelector(".movies");
    content.innerHTML = "";
  }
});

// event binding = elemen yang awalnya tidak ada kemudian ada

document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("detailButton")) {
    const imdbID = e.target.dataset.id;
    const detail = await detailMovie(imdbID);
    detailUI(detail);
  }
});

function getMovies(search) {
  return fetch("http://www.omdbapi.com/?apikey=cbe077fe&s=" + search)
    .then((response) => {
      if (!response.ok) {
        throw { pesan: "Something went wrong!!!!" };
      } else {
        return response.json();
      }
    })
    .then((response) => {
      if (response.Response === "False") {
        throw { title: "Failed", kosong: "Movie Not Found!!!" };
      } else {
        return response.Search;
      }
    });
}

function moviesUI(movies) {
  let results = "";
  const content = document.querySelector(".movies");
  movies.forEach((movie) => {
    results += showMovie(movie);
  });
  content.innerHTML = results;
  const alertBox = document.querySelector(".alert");
  alertBox.innerHTML = "";

  // console.log(movies.length);
}

function kosong() {
  return `<div class="row"></div>`;
}

function detailMovie(imdbID) {
  return fetch("http://www.omdbapi.com/?apikey=cbe077fe&i=" + imdbID).then((response) => {
    return response.json().then((m) => {
      return m;
    });
  });
}

function detailUI(detail) {
  let movieDetail = showDetail(detail);
  const detailBox = document.querySelector(".modal-body");
  detailBox.innerHTML = movieDetail;
}

function showMovie(movie) {
  return `<div class="col-md-4 my-3">
    <div class="card">
        <img src="${movie.Poster}" class="card-img-top" />
        <div class="card-body">
            <h5 class="card-title">${movie.Title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
            <a href="#" class="btn btn-primary detailButton" data-bs-toggle="modal" data-bs-target="#modalMovies" data-id="${movie.imdbID}">Detail</a>
        </div>
    </div>
</div>`;
}

function showDetail(result) {
  return `<div class="container-fluid">
<div class="row">
  <div class="col-md-3">
    <img src="${result.Poster}" class="img-fluid" alt="" />
  </div>
  <div class="col-md">
    <ul class="list-group">
      <li class="list-group-item">
        <h4>${result.Title} (${result.Year})</h4>
      </li>
      <li class="list-group-item"><strong>Director : </strong> ${result.Director}</li>
      <li class="list-group-item"><strong>Actors :</strong> ${result.Actors}</li>
      <li class="list-group-item"><strong>Writer :</strong> ${result.Writer}</li>
      <li class="list-group-item"><strong>Imdb Rating :</strong> ${result.imdbRating}</li>
      <li class="list-group-item">
        <strong>Plot :</strong><br />
        ${result.Plot}
      </li>
    </ul>
  </div>
</div>
</div>`;
}
