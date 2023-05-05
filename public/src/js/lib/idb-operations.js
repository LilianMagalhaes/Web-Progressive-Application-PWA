async function createDB(infosDB) {
  return await idb.open(infosDB.db, 1, (db) => {
    //retourne une Promise de la DB
    let storesList = infosDB.stores;
    for (let aStore of storesList) {
      if (!db.objectStoreNames.contains(aStore.st)) {
        //films la «table»
        db.createObjectStore(aStore.st, { keyPath: aStore.id }); //clé de recherche
      }
    }
  });
}

async function registerElement(st, data) {
  console.log(`register element received ${data}, ${st}`);
  const db = await dbPromise;
  console.log(`db === ${db}`);
  let tx = db.transaction(st, "readwrite");
  let store = tx.objectStore(st);
  console.log(`store === ${st}`);
  store.put(data);
  console.log(
    `store.put.data === ${JSON.stringify(store)}, ${JSON.stringify(data)}`
  );
  console.log(`tx.complete sent=== ${JSON.stringify(tx.complete)}`);
  return tx.complete;
}

async function storeContent(st) {
  const db = await dbPromise;
  let tx = db.transaction(st, "readonly");
  let store = tx.objectStore(st);
  return store.getAll();
}

function deleteElement(st, id) {
  console.log(`deleteElement received ${st} and ${id}`);
  dbPromise
    .then(function (db) {
      let tx = db.transaction(st, "readwrite");
      let store = tx.objectStore(st);
      store.delete(id);
      console.log(`film ${id} deleted from ${st} ${tx.complete}`);
      return tx.complete;
    })
    .then(function () {
      console.log(`Elément ${id} supprimé de le store ${st}`);
    });
}

async function viderStore(st) {
  const db = await dbPromise;
  let tx = db.transaction(st, "readwrite");
  let store = tx.objectStore(st);
  store.clear();
  return tx.complete;
}
