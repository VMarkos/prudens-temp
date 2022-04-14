function burgerMenuDrop() {
    const menu = document.getElementById("hamburger-menu");
    const mainContainer = document.getElementById("main-container");
    const menuBurger = document.getElementById("menu-burger");
    const menuOptionsContainer = document.getElementById("menu-options-container");
    if (menuBurger.className === "fa fa-bars fa-2x") {
      // menu.style.display = "block";
      menu.classList.remove("hidden");
      menu.classList.add("visible");
      menuBurger.className = "fa fa-remove fa-2x";
      mainContainer.style.filter = "blur(10px)";
      // menu.classList.add("show-menu-animation");
    } else {
      // menu.style.transition = "visibility 0s 200ms";
      // menu.style.display = "none";
      // menu.style.visibility = "hidden";
      menu.classList.remove("visible");
      menu.classList.add("hidden");
      menuBurger.className = "fa fa-bars fa-2x";
      mainContainer.style.filter = "blur(0)";
      // menu.style.transition = "visibility 0s 0s";
      // menu.classList.remove("show-menu-animation");
    }
  }