//getFilmsData(); //in films-script.js

async function getFilms() {
  let jsonFile;
  let response;
  try {
    response = await fetch("/getFilms");
    //alert(`fetch from route /getFilms json file`);
    jsonFile = await response.json();
  } catch (error) {
    jsonFile = [];
    console.error(error);
  }
  return jsonFile;
}

function addFilm(newFilm) {
  alert(`addFilm received === ${newFilm}`);
  fetch("/addFilm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newFilm),
  })
    .then(alert("Film ajoute avec succès"), readNewJsonFile())
    .catch((err) => console.log(err));
}

async function readNewJsonFile() {
  alert("reading new json file");
  let newData = await getFilms();
  alert("got new json file");
  displayFilmsCards(newData);
}

//function addMember() {
//  let formData = new FormData(document.getElementById("form-addMember"));
//  fetch("/addMember", {
//    method: "POST",
//    headers: {
//      "Content-Type": "application/json",
//      Accept: "application/json",
//    },
//    body: JSON.stringify(Object.fromEntries(formData)),
//  }).catch((err) => console.log(err));
//}
