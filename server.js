const util = require("./server/utilitaires/dataManagement");
const path = require("path");
const lodash = require("lodash");
const root_path = require("./server/utilitaires/root_path");
const webpush = require("web-push");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8088;

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`New conection... 
    Server running at http://localhost:${PORT}/`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/getFilms", async (request, response) => {
  console.log("Route GET /getFilms");
  try {
    let jsonFile = __dirname + "/public/src/data/films.json";
    const json = fs.readFileSync(jsonFile, "utf8");
    const result = JSON.parse(json);
    response.json(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/addFilm", (request, response) => {
  console.log("Route POST /addFilm");
  let newFilm = {
    id: request.body.id,
    title: request.body.title,
    year: request.body.year,
    director: request.body.director,
    genre: request.body.genre,
    runtime: request.body.runtime,
    poster: `images/posters/poster.jpg`,
  };
  console.log(`newFilm === ${newFilm}`);

  let stringNewFilm = JSON.stringify(newFilm); //retourner au client
  //lire le fichier original films.json
  let jsonFile = __dirname + "/public/src/data/films.json";
  const json = fs.readFileSync(jsonFile, "utf8");
  const tabFilms = JSON.parse(json); //convertir dans un tableau
  tabFilms.push(newFilm); //ajouter le nouveau dans le tableau
  let stringTabFilms = JSON.stringify(tabFilms); //convertir en string
  //écrire le tout dans le fichier
  fs.writeFileSync(jsonFile, stringTabFilms);

  //let filmsJsonPath = path.join(root_path, "/public/src/data/films.json");
  //util.saveData(filmsJsonPath, newFilm);

  /* let subscriptionsJsonFile = path.join(
    root_path,
    "/server/data/subscriptions.json"
  );
  let tabSubscriptions = util.subscriptionList(subscriptionsJsonFile);

  //Paramètres identifient du la compagnie (dans un vrai contexte fournir une vraie adresse),
  //clé publique et clé privée
  webpush.setVapidDetails(
    "mailto:aaaa@gmail.com",
    "BGgq3HS_dZzJYqLm9r3gqwGSoXnFV94sqiiNf1MjQ1qSd1COMITQb1DHq5iIx7-z8QTpoLZOQ0_EbLSwGqNIbAU",
    "sixJ1OigM0co8AJn3dWFSvlw8zr7axo-Ypk7mA_9PTo"
  );*/
  /* tabSubscriptions.forEach((subsc) => {
    let pushConfig = {
      endpoint: subsc.endpoint,
      keys: {
        auth: subsc.keys.auth,
        p256dh: subsc.keys.p256dh,
      },
    };
    webpush
      .sendNotification(
        pushConfig,
        JSON.stringify({
          title: "Nouveau film",
          content: "Un nouveau film vient d'être ajouté.",
          url: "http://collections.cinematheque.qc.ca/",
        })
      )
      .catch((err) => {
        console.log(err);
      });
  });*/ //fin forEach
  //retour de la réponse à la demande pour enregistrer. Le code de statut HTTP 201 Created indique que la requête a
  //réussi et qu'une ressource a été créée en conséquence.
  //response
  // .status(201)
  // .json({ message: "Film enregistré", id: body.request.title });
  //retour de la réponse au client. Une autre façon.

  response.header("Content-type", "application/json");
  response.header("Charset", "utf8");
  response.send(stringNewFilm);
});

app.post("/push-subscriptions", (request, response) => {
  const aSubscription = request.body;
  if (!lodash.isEmpty(aSubscription)) {
    let subscriptionsJsonFile = path.join(
      root_path,
      "/server/data/subscriptions.json"
    );
    util.saveData(subscriptionsJsonFile, aSubscription); //chemin et fichier et data
  }
  response.end();
});

//app.post("/addMember", (request, response) => {
//  //ou req.body au lieu de response
//  let newMember = {
//    id: request.body.id,
//    nameFirst: request.body.nameFirst,
//    nameLast: request.body.nameLast,
//    userName: request.body.userName,
//    email: request.body.email,
//    teste: `teste add member`,
//  };
//
//  let stringnewMember = JSON.stringify(newMember); //retourner au client
//  //lire le fichier original films.json
//  let jsonFile = __dirname + "/public/src/data/members.json";
//  const json = fs.readFileSync(jsonFile, "utf8");
//  const tabMembers = JSON.parse(json); //convertir dans un tableau
//  tabFilms.push(newMember); //ajouter le nouveau dans le tableau
//  let stringTabMembers = JSON.stringify(tabMembers); //convertir en string
//  //écrire le tout dans le fichier
//  fs.writeFileSync(jsonFile, stringTabMembers);
//
//  //retour de la réponse au client
//  response.header("Content-type", "application/json");
//  response.header("Charset", "utf8");
//  response.send(stringnewMember); //on retourne le nouveau film pour l'afficher dans la page du client
//});
