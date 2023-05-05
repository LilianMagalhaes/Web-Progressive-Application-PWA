let infosDB = {
  bd: "dbfilms",
  stores: [
    { st: "films", id: "id" },
    { st: "sync-films", id: "id" },
    { st: "members", id: "id" },
    { st: "sync-members", id: "id" },
  ],
};
let dbPromise = createDB(infosDB);

// ADD A NEW FILM FORM:
let submitNewFilm = document.getElementById("btn-submit-film");

console.log(`submitNewFilm === ${submitNewFilm}`);
submitNewFilm.addEventListener("click", (event) => {
  let title = document.getElementById("addTitle");
  let director = document.getElementById("addDirector");
  let genre = document.getElementById("addCategory");
  let year = document.getElementById("addYear");
  let runtime = document.getElementById("addRuntime");
  console.log(
    `newFilm infos === ${title}, ${director}, ${genre}, ${runtime}, ${genre}`
  );
  //formAddFilm.addEventListener("submit", (event) => {

  console.log(`event  submit/addFilm === ${event},${event.target}`);
  event.preventDefault(); //pour éviter le submit par défaut qu'envoie tout de suite les données

  if (title.value.trim() === "" || director.value.trim() === "") {
    //on ferait une vraie validation des données
    alert("Vérifiez vos données!");
  } else {
    let newFilm = {
      //film à envoyer au serveur
      id: `${year.value}${runtime.value}`,
      title: title.value,
      director: director.value,
      genre: genre.value,
      year: year.value,
      runtime: runtime.value,
      poster: "images/poster/poster.jpeg",
    };
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready.then((sw) => {
        //instance du SW
        alert(`newFilm submit/addFilm === ${newFilm} - syncManager`);
        //enregistrer les infos du film dans notre BD bdfilms
        registerElement("sync-films", newFilm) //in idb-operations.js
          .then(function () {
            alert("Enregistré dans le store sync-films");
            console.log("Enregistré dans le store sync-films");
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    } else {
      addFilm(newFilm); //in films-service.js
      alert(`newFilm submit/addFilm === ${newFilm} - direct, no syncManager`);
    }
  }
});

//// ADD A NEW MEMBER FORM:
//let formAddMember = document.getElementById("#formAddMember");
//let userName = document.getElementById("userName");
//let nameLast = document.getElementById("nameLast");
//let nameFirst = document.getElementById("nameFirst");
//let email = document.getElementById("email");
//let password = document.getElementById("pass");
//
//formAddMember.addEventListener("submit", (event) => {
//  event.preventDefault(); //pour éviter le submit par défaut qu'envoie tout de suite les données
//  if (
//    userName.value.trim() === "" ||
//    email.value.trim() === "" ||
//    password.value.trim() === ""
//  ) {
//    let msgErrMember = "";
//    msgErrMember += "Vérifiez vos données!";
//    document.getElementById("msgErrMember").innerHTML = msgErrMember;
//    setInterval(() => {
//      document.getElementById("msgErrMember").innerHTML = "";
//    });
//  } else {
//    if ("serviceWorker" in navigator && "SyncManager" in window) {
//      navigator.serviceWorker.ready.then((sw) => {
//        //instance du SW
//        validerFormAddMember();
//        let newMember = {
//          //film à envoyer au serveur
//          id: `${password.value}-${userName.value}`,
//          userName: userName.value,
//          nameLast: nameLast.value,
//          nameFirst: nameFirst.value,
//          email: email.value,
//          password: password.value,
//        };
//        //enregistrer les infos du film dans notre BD bdfilms
//        registerElement("sync-members", newMember) //in idb-operations.js
//          .then(function () {
//            return sw.sync.register("sync-new-member"); //tag de notre Sync Task enregistré dans le SW
//          })
//          .then(function () {
//            document.getElementById("msg-addMember").innerHTML =
//              "Enregistré dans le store sync-members";
//            setInterval(() => {
//              document.getElementById("msg-addMember").innerHTML = "";
//            }, 5000);
//          })
//          .catch(function (err) {
//            console.log(err);
//          });
//      });
//    } else {
//      addMember(); //in films-service.js
//    }
//  }
//});
//
//// CONECTION FORM:
//
//let formConnection = document.getElementById("#formConnection ");
//formConnection.addEventListener("submit", (event) => {
//  event.preventDefault();
//  if (userName.value.trim() === "" || password.value.trim() === "") {
//    let msgErrMember = "";
//    msgErrMember += "Vérifiez vos données!";
//    document.getElementById("msgErrMember").innerHTML = msgErrMember;
//    setInterval(() => {
//      document.getElementById("msgErrMember").innerHTML = "";
//    });
//  } else {
//    document.getElementById(
//      "#msg-conection"
//    ).innerHTML = `${userName.value} est connecté !`;
//    setInterval(() => {
//      document.getElementById("#msg-addMember").innerHTML = "";
//    }, 5000);
//  }
//});
//
//function validerFormAddMember() {
//  let msgErrMember = "";
//  let valide = true;
//  let pass = document.getElementById("pass").value;
//  let cpass = document.getElementById("cpass").value;
//  if (pass != cpass) {
//    valide = false;
//    msgErrMember += "Les mots de passe sont différents!<br/>";
//  }
//  if (!valide) {
//    document.getElementById("msgErrMember").innerHTML = msgErrMember;
//    setInterval(() => {
//      document.getElementById("msgErrMember").innerHTML = "";
//    }, 3000);
//  }
//  return valide;
//}
