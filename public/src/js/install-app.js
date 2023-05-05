document.addEventListener("DOMContentLoaded", () => {
  // *********** PWA installation management ***********//

  // Initialize deferredPrompt for use later to show browser install prompt.
  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Show the install button.
    document.querySelector("#install-app").style.display = "block";
    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`'beforeinstallprompt' event was fired.`);
  });

  // Create an event listener for the installation button.
  const InstallAppBtn = document.querySelector("#install-app");
  InstallAppBtn.addEventListener("click", async () => {
    // Hide the app provided install promotion
    document.querySelector("#install-app").style.display = "none";
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
  });

  window.addEventListener("appinstalled", () => {
    // Hide the app-provided install promotion
    document.querySelector("#install-app").style.display = "none";
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    // Optionally, send analytics event to indicate successful install
    console.log("PWA was installed");
  });

  function getPWADisplayMode() {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    if (document.referrer.startsWith("android-app://")) {
      return "twa";
    } else if (navigator.standalone || isStandalone) {
      return "standalone";
    }
    return "browser";
  }
  window
    .matchMedia("(display-mode: standalone)")
    .addEventListener("change", (evt) => {
      let displayMode = "browser";
      if (evt.matches) {
        displayMode = "standalone";
      }
      // Log display mode change to analytics
      console.log("DISPLAY_MODE_CHANGED", displayMode);
    });
});
