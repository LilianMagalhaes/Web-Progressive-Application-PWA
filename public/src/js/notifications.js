//Gestion des permission
//Cas : demande de permission

let notificationsButtons = document.querySelectorAll(
  ".permission-notification"
);

const showNotification = () => {
  if ("serviceWorker" in navigator) {
    let options = {
      body: "Vous avez maintenant l'autorisation d'utiliser les Notifications Push!",
      icon: "/src/images/icons/icon-96x96.png",
      image: "/src/images/icons/notif.png",
      vibrate: [100, 50, 200],
      badge: "/src/images/icons/icon-96x96.png",
      tag: "notification-confirmation",
      renotify: true,
      actions: [
        {
          action: "accepter",
          title: "Accepter",
          icon: "/src/images/icons/icon-96x96.png",
        },
        {
          action: "annuler",
          title: "Annuler",
          icon: "/src/images/icons/icon-96x96.png",
        },
      ],
    };

    navigator.serviceWorker.ready.then((sw) => {
      sw.showNotification("Merci de votre demande!", options);
    });
  }
};

const requestPermission = () => {
  Notification.requestPermission((resp) => {
    if (resp !== "granted") {
      console.log("Permission refusée!");
    } else {
      console.log("Permission acceptée");
      settingsPushSub();
    }
  });
};

if ("Notification" in window) {
  for (let notificationBtn of notificationsButtons) {
    notificationBtn.addEventListener("click", requestPermission);
    notificationBtn.style.display = "block";
  }
}

//Notifications Push
const settingsPushSub = () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  let swab;
  navigator.serviceWorker.ready
    .then((sw) => {
      swab = sw; //pouvoir l'utiliser globalement
      return sw.pushManager.getSubscription();
    })
    .then((abo) => {
      if (abo === null) {
        // Créer un nouveau abonnement
        let vapidPublicKey =
          "BGgq3HS_dZzJYqLm9r3gqwGSoXnFV94sqiiNf1MjQ1qSd1COMITQb1DHq5iIx7-z8QTpoLZOQ0_EbLSwGqNIbAU";
        let newVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return swab.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: newVapidPublicKey,
        });
      } else {
        // //console.log("Fini abonnement");
        // // on a déjà une inscription pour cette app et ce navigateur
        //    abo.unsubscribe().then(function(successful) {
        //    })
        // return;
      }
    })
    .then((newSubscription) => {
      return fetch("/push-subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newSubscription),
      });
    })
    .then(function (res) {
      if (res.ok) {
        showNotification();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};
