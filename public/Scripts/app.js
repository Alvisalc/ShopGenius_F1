// IIFE -- Immediately Invoked Function Expression
(function () {
  function Start() {
    console.log("App Started...");

    let deleteButtons = document.querySelectorAll(".del-alert");

    for (button of deleteButtons) {
      button.addEventListener("click", (event) => {
        if (!confirm("Are you sure?")) {
          event.preventDefault();
          window.location.assign("/product");
        }
      });
    }

    let deleteCartButtons = document.querySelectorAll(".del-cartitem-alert");

    for (button of deleteCartButtons) {
      button.addEventListener("click", (event) => {
        if (!confirm("Are you sure?")) {
          event.preventDefault();
          window.location.assign("/cart");
        }
      });
    }
  }
  window.addEventListener("load", Start);
})();
