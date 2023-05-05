const fs = require("fs");

exports.saveData = (jsonFile, data) => {
  console.log(`saveData received === ${jsonFile} ; ${data}`);
  const jsonData = fs.readFileSync(jsonFile, "utf8");
  const tabDatas = JSON.parse(jsonData); //convertir dans un tableau
  tabDatas.push(data); //ajouter le nouveau dans le tableau
  fs.writeFileSync(jsonFile, JSON.stringify(tabDatas));
  console.log(
    `writeFileSync sent === ${jsonFile} ; ${JSON.stringify(tabDatas)}`
  );
};

exports.subscriptionList = (jsonFile) => {
  console.log(`subscriptionlist received === ${jsonFile}`);
  const jsonData = fs.readFileSync(jsonFile, "utf8");
  let tabDatas = JSON.parse(jsonData); //convertir dans un tableau
  console.log(`subscriptionlist sent === ${tabDatas}`);
  return tabDatas;
};
