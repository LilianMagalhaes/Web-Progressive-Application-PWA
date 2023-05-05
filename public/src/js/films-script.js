let tabFilms = [];

async function getFilmsData() {
  let jsonFile = await getFilms();
  await chargeTabFilms(jsonFile);
  //alert(`getFilmsData send to chargeTabFilms = ${jsonFile}`);
}

async function chargeTabFilms(jsonFile) {
  if (jsonFile.length > 0) {
    tabFilms = jsonFile;
    displayFilmsCards(tabFilms);
    //alert(`chargeTabFilms send to displayFilmsCards = ${tabFilms}`);
  } else {
    //when offline, it goes to get data in the films store
    tabFilms = await storeContent("films");
    displayFilmsCards(tabFilms);
  }
}

//create an event listener for accueil and each category of film to filter films by category or show all:

[...document.getElementsByClassName("category-filter")].forEach((button) => {
  button.addEventListener("click", (event) => {
    let category = event.target.getAttribute("id");
    if (
      category === "allFilms" ||
      category === "accueil" ||
      category === "img-icon"
    ) {
      displayFilmsCards(tabFilms);
    } else {
      const filteredFilms = filterByCategory(category, tabFilms);
      displayFilmsCards(filteredFilms);
    }
  });
});

const filterByCategory = (category, list) => {
  let filteredFilms = [];
  for (const film of list) {
    if (film.genre.toLowerCase().includes(category.toLowerCase())) {
      filteredFilms.push(film);
    }
  }
  return filteredFilms;
};

const createCards = (listFilms) => {
  let cards = [];
  listFilms.forEach((film) => {
    let filmCard = `<div class="card film-card p-9"">
      <img  id="img-card" src="src/${film.poster}" class="card-img-top img-card" alt="...">
      <div class="card-body p-0" id="card-body">
         <h5 class="card-title text-warning" >${film.title}</h5> 
          <p class="card-text lh-1 fw-light fs-6">${film.year}</p>
          <p class="card-text lh-1" id="genre">${film.genre}</p>
      </div>
      <div class="end-0 mt-3">
            <a href="#" class="btn btn-warning btn-plus" id="${film.id}">Savoir plus...</a>
          </div>
    </div>`;
    cards.push(filmCard);
  });
  return cards;
};

//*Create addEventListener an call a function for each Film card button :
const addSavoirPlusEventListener = () => {
  [...document.getElementsByClassName("btn-plus")].forEach((button) => {
    button.addEventListener("click", (event) => {
      let id = event.target.getAttribute("id");
      let filteredIdFilm = findById(id, tabFilms);
      displayFilm(filteredIdFilm);
    });
  });
};

//Create HTML elements and display films cards:
const displayFilmsCards = (films) => {
  let wrap = document.getElementById("displayCards");
  wrap.innerHTML = "";
  let cards = createCards(films);
  for (const card of cards) {
    wrap.insertAdjacentHTML("beforeEnd", card);
  }
  wrap.style.display = "flex";
  document.getElementById("displayFilm").style.display = "none";
  addSavoirPlusEventListener();
};

displayFilmsCards(tabFilms);

const findById = (id, list) => {
  let filteredIdFilm = "";
  for (const film of list) {
    if (film.id === id) {
      filteredIdFilm = film;
    }
  }
  return filteredIdFilm;
};

//Create HTML elements and display films cards:
const displayFilm = (filteredIdFilm) => {
  const filmFound = filteredIdFilm;
  console.log("filteredfilmbyid=" + filteredIdFilm);
  let aFilm = "";
  let wrap = document.getElementById("displayFilm");
  wrap.innerHTML = "";
  aFilm = createFilm(filmFound);
  wrap.insertAdjacentHTML("beforeEnd", aFilm);
  //*Switch between containers
  wrap.style.display = "flex";
  document.getElementById("displayCards").style.display = "none";
};

const createFilm = (filmFound) => {
  if (filmFound.runtime.toLowerCase() != "n/a") {
    filmFound.runtime = `${filmFound.runtime} min`;
  }
  let aFilm = `<div class="card-body justify-content-center">
        <img class="card-img-top m-3" id="img-film" src="src/${filmFound.poster}"  alt="...">
        </div>
        <div class="card-body justify-content-center ms-2 film">
          <h4 class="card-title text-warning p-2">${filmFound.title}</h4>
          <ul class="film-info card-text lh-2 fw-lighter ps-2">
          <li class="film-info card-text lh-2 fw-light fs-6 d-inline"><strong>Year:</strong> ${filmFound.year}</li>
          <li class="film-info d-inline"><strong>RunTime:</strong> ${filmFound.runtime}</li>
          <li class="film-info d-inline"><strong>Category:</strong>${filmFound.genre}</li>
          <li class="film-info d-inline"><strong>Director:</strong> ${filmFound.director}</li>
          <li class="film-info d-inline"><strong>Writer:</strong> ${filmFound.writer}</li>
          <li class="film-info d-inline"><strong>Actors:</strong> ${filmFound.actors}</li>
          </ul>
          <p class="film-info card-text lh-2 fw-lighter ps-2">${filmFound.plot}</p>
          <div class="end-0 mt-2 justify-content-center" id="${filmFound.id}">
            <a href="#" class="btn btn-warning justify-content-center align-content-center p-2 m-2 btn-play">
            PLAY<image id="img-play" src="src/images/iconPlay.svg" alt=""></a>
          </div>
        </div>
     </div>`;
  return aFilm;
};
