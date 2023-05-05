importScripts("/src/js/lib/idb.js");
importScripts("/src/js/lib/idb-operations.js");
const PORT = 8088;
const cacheVersion = "1";
const STATIC_CACHE__NAME = `static-site-${cacheVersion}`;
const DYNAMIC_CACHE_NAME = `dynamic-site-${cacheVersion}`;
//Ressources statiques pour mettre en cache

let infosDB = {
  db: "DBfilms",
  stores: [
    { st: "films", id: "id" },
    { st: "sync-films", id: "id" },
    { st: "members", id: "id" },
    { st: "sync-members", id: "id" },
  ],
};
let dbPromise = createDB(infosDB);

const RESOURCES = [
  "/",
  "/index.html",
  "/favicon.ico",
  "src/images/iconPlay.svg",

  "/manifest.webmanifest",
  "src/css/style.css",

  "src/utilitaires/bootstrap-5.3.0-alpha1-dist/css/bootstrap.min.css",
  "src/utilitaires/bootstrap-5.3.0-alpha1-dist/js/bootstrap.bundle.min.js",
  "src/utilitaires/jquery-3.6.3.min.js",
  "src/js/lib/idb.js",

  "src/data/films.json",

  "src/js/films-script.js",
  "src/js/sw-register.js",
  "src/js/forms.js",
];

self.addEventListener("install", function (event) {
  console.log("[Service Worker] Installing SW ...", event);
  event.waitUntil(
    caches.open(STATIC_CACHE__NAME).then((cache) => {
      cache.addAll(RESOURCES);
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("[Service Worker] Activating SW ...");
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== STATIC_CACHE__NAME && key !== DYNAMIC_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  let jsonPath = `http://localhost:${PORT}/getFilms`;
  console.log("[Service Worker] Fetching...", event.request.url);
  /* console.log("[Service Worker] jsonPath===", jsonPath);
  console.log(
    "[Service Worker] event.request.url.indexOf(jsonPath) > -1 ===",
    event.request.url.indexOf(jsonPath)
  );
  console.log("[Service Worker] event.request===", event.request);*/
  if (event.request.url.indexOf(jsonPath) > -1) {
    console.log("test1");
    event.respondWith(
      fetch(event.request).then((resp) => {
        let cloneResp = resp.clone();
        cloneResp.json().then((data) => {
          //const dataString = JSON.stringify(data);
          //console.log(`test1.1: data === ${dataString}`);
          console.log(`test1.1: data === ${data}`);
          for (let film of data) {
            registerElement("films", film);
            console.log("registerElement send ===", film);
          }
          return resp;
        });
        return resp;
      })
    );
  } else {
    console.log("test 2");
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          return (
            response ||
            fetch(event.request).then(async (resp) => {
              const cache = await caches.open(DYNAMIC_CACHE_NAME);
              // vous devez stoker absolument un clone de la réponse soit resp
              cache.put(event.request.url, resp.clone());
              return resp;
            })
          );
        })
        .catch((err) => {})
    );
  }
});

self.addEventListener("sync", function (event) {
  console.log(`event listener sync new film ===`, event.tag);
  if (event.tag === "sync-new-film") {
    console.log("[Service Worker] sync new film");
    event.waitUntil(
      storeContent("sync-films").then((films) => {
        for (let aFilm of films) {
          console.log("in SW");
          console.log(JSON.stringify(aFilm));
          fetch("/addFilm", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(aFilm),
          })
            .then((response) => {
              console.log(response);
              //afficherDansListeFilms(leFilmEnregistre);
              if (response.ok) {
                deleteElement("sync-films", aFilm.id);
                console.log(`deleteElement sent "sync-films" and ${aFilm.id}`);
              }
            })
            .catch((err) => {
              console.log("Erreur avec envoyer les données", err);
            });
        }
      })
    );
  }
});

self.addEventListener("sync", function (event) {
  if (event.tag === "sync-new-member") {
    console.log("[Service Worker] sync new member");
    event.waitUntil(
      contenuStore("sync-member").then((members) => {
        for (let aMember of members) {
          console.log("in SW");
          console.log(JSON.stringify(aMember));
          fetch("/addMember", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(aMember),
          })
            .then((res) => {
              console.log(res);
              //afficherDansListeFilms(leFilmEnregistre);
              if (res.ok) {
                deleteElement("sync-member", aMember.id);
              }
            })
            .catch((err) => {
              console.log("Error in sending data", err);
            });
        }
      })
    );
  }
});
