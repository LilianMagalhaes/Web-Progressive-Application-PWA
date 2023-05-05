document.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw-films.js")
      .then(function () {
        console.log("servive worker was successfully registered!");
      })
      .catch(function (err) {
        console.log("Error registering SW" + err);
      });
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    console.log("We are on beforeinstallprompt");
    event.preventDefault();
    let deferredPrompt = event;
    return false;
  });
});

//Uninstall all Services workers.
//navigator.serviceWorker.getRegistrations().then(function (registrations) {
//  for (let registration of registrations) {
//    registration.unregister();
//  }
//});
