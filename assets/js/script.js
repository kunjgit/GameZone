"use strict";

// Pagination in games section
// Variable for Active Page
let pageActive = 0;

const previousPageTile = document.getElementById("prev-page-tile");
const nextPageTile = document.getElementById("next-page-tile");

function getPageNumbers() {
  const pagination_section = document.querySelector(".pagination_section");
  const games = document.querySelectorAll(".project-item");
  pagination_section.innerHTML = "";
  for (let i = 0; i < games.length; i += 20) {
    const child = document.createElement("div");
    if (i == 0) {
      child.innerHTML = `<div id="first-page-tile" class="page-tile active">${
        i / 20 + 1
      }</div>`;
    } else {
      child.innerHTML = `<div class="page-tile">${i / 20 + 1}</div>`;
    }
    pagination_section.appendChild(child);
  }

  pageActive = 0;
  previousPageTile.setAttribute("disabled", true);
  for (let i = 20; i < games.length; i++) {
    games[i].style.display = "none";
  }
}

function getProjectsInPage() {
  const pageTile = document.querySelectorAll(".page-tile");
  const games = document.querySelectorAll(".project-item");
  const clickSound = document.getElementById("clickSound");
  for (let i = 0; i < games.length; i++) {
    games[i].addEventListener("click", () => {
      clickSound.play();
    });
  }

  pageTile.forEach((elem, index) => {
    elem.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      pageTile[pageActive].classList.remove("active");
      pageActive = index;
      elem.classList.add("active");
      const page = Number(elem.textContent) - 1;
      if (page > 0) {
        previousPageTile.removeAttribute("disabled");
      } else {
        previousPageTile.setAttribute("disabled", true);
      }

      if (index == pageTile.length - 1) {
        nextPageTile.setAttribute("disabled", true);
      } else {
        nextPageTile.removeAttribute("disabled");
      }
      for (let i = 0; i < games.length; i++) {
        if (i >= page * 20 && i < page * 20 + 20) {
          games[i].style.display = "block";
        } else {
          games[i].style.display = "none";
        }
      }
    });
  });
}

function goToNextPage() {
  const pageTile = document.querySelectorAll(".page-tile");
  pageTile[pageActive].classList.remove("active");
  pageActive++;
  pageTile[pageActive].click();
  pageTile[pageActive].classList.add("active");
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function goToPreviousPage() {
  const pageTile = document.querySelectorAll(".page-tile");
  pageTile[pageActive].classList.remove("active");
  pageActive--;
  pageTile[pageActive].click();
  pageTile[pageActive].classList.add("active");
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector(
      "[data-testimonials-title]"
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      "[data-testimonials-text]"
    ).innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn && modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay && overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select &&
  select.addEventListener("click", function () {
    elementToggleFunc(this);
  });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// Code for enabling Light-Dark THEME

function toggleTheme() {
  var slider = document.getElementById("themeToggle");
  if (slider.checked) {
    disableDarkTheme();
    disableChangeColor();
  } else {
    enableDarkTheme();
    changeColor();
  }
}

function changeColor() {
  var contributor = document.getElementById('total-contributors');
  contributor.style.color = "black";
}

function disableChangeColor() {
  var col = document.getElementById('total-contributors');
  col.style.color = "white";
}

function enableDarkTheme() {
  var elements = document.getElementsByTagName("*");
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (
      element.tagName !== "BODY" &&
      !element.classList.contains("ignore-dark-theme") &&
      !element.classList.contains("project-category") &&
      !element.classList.contains("footer")
    ) {
      element.classList.add("dark-theme");
    }
  }

  // Adding specific background color for the footer
  var footer = document.querySelector("footer");
  if (footer) {
    footer.classList.add("dark-theme");
  }
}

function disableDarkTheme() {
  var elements = document.getElementsByTagName("*");
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (
      element.tagName !== "BODY" &&
      !element.classList.contains("ignore-dark-theme") &&
      !element.classList.contains("project-category")
    ) {
      element.classList.remove("dark-theme");
    }
  }
}

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  var wrapper = document.getElementById("themeToggleWrapper");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    wrapper.style.opacity = "0";
  } else {
    wrapper.style.opacity = "1";
  }
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// // page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  for (let i = 0; i < pages.length; i++) {
    if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
      pages[i].classList.add("active");
      navigationLinks[i].classList.add("active");
      window.scrollTo(0, 0);
    } else {
      pages[i].classList.remove("active");
      navigationLinks[i].classList.remove("active");
    }
  }
}

function search_game() {
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  let searchelement = document.getElementsByClassName("project-item  active");
  for (let i = 0; i < searchelement.length; i++) {
    if (!searchelement[i].innerHTML.toLowerCase().includes(input)) {
      searchelement[i].style.display = "none";
    } else {
      searchelement[i].style.display = "list-item";
    }
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchGamesData();
});

let gamesData = {};

function fetchGamesData() {
  fetch("./assets/js/gamesData.json") // Assuming gamesData.json is in the same directory
    .then((response) => response.json())
    .then((data) => {
      gamesData = data;
    })
    .catch((error) => console.error("Error fetching games data:", error));
}
