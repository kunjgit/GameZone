// Generate <li> tags dynamically

const generateLiTags = (gamesData, searchText = "") => {
  const liTags = [];
  searchText = searchText.trim().toLowerCase(); // Trim whitespace and convert to lowercase

  for (let tagNumber = 1; tagNumber <= 417; tagNumber++) {
    const gameData = gamesData[tagNumber.toString()];

    if (gameData) {
      const { gameTitle, gameUrl, thumbnailUrl } = gameData;
      if (gameTitle.toLowerCase().includes(searchText)) {
        const liked = localStorage.getItem(`liked-${tagNumber}`) === "true";
        const liTag = `
          <li class="project-item active" data-filter-item data-category="open source">
            <a href="./Games/${gameUrl}" target="_blank" aria-label="${gameTitle}">
              <figure class="project-img">
                <div class="project-item-icon-box">
                  <img id="joystick" src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png" alt="Eye" width="3" />
                </div>
                <img src="./assets/images/${thumbnailUrl}" alt="${gameTitle}" loading="lazy">
              </figure>
              <div class="title-container">
                <a href="https://github.com/kunjgit/GameZone/tree/main/Games/${gameUrl}" target="_blank" aria-label="${gameTitle}">${tagNumber}. ${gameTitle} 🔗</a>
                <button class="like-button ${liked ? 'liked' : ''}" onclick="like(this, ${tagNumber})">♡</button>
              </div>
            </a>
          </li>
        `;
        liTags.push(liTag);
      }
    }
  }
  //if no games found
  if (liTags.length === 0) {
    const liTag = `
          <li style="color:white; text-align:center;">
            --No Games Found--
          </li>
          <style>
          .project-list{
            grid-template-columns: 1fr;
          }
          </style>
        `;
    liTags.push(liTag);
  }

  return liTags.join("\n");
};

// Fetch the game data from the JSON file
fetch("./assets/js/gamesData.json")
  .then((response) => response.json())
  .then((gamesData) => {
    const projectListContainer = document.querySelector(".project-list");
    projectListContainer.innerHTML = generateLiTags(gamesData);
    getPageNumbers();
    getProjectsInPage();

    // Search functionality
    const searchInput = document.getElementById("searchbar");
    searchInput.addEventListener("input", () => {
      projectListContainer.innerHTML = generateLiTags(
        gamesData,
        searchInput.value
      );
    });
  })
  .catch((error) => console.error("Error fetching game data:", error));

window.addEventListener("scroll", function () {
  var scrollToTopButton = document.getElementById("progress");
  if (window.pageYOffset > 200) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
});

//Focusing on the input box on clicking anywhere in the container div, and not just in the input box(which is 60% width) which leaves dead space on both sides
// Get references to the div and input elements
const searchContainer = document.getElementById("search-container-id");
const searchInput = document.getElementById("searchbar");
const clearButton = document.getElementById("clearButton");

// Add a click event listener to the div
searchContainer.addEventListener("click", function () {
  // Focus on the input field when the div is clicked
  searchInput.focus();
});

// Improved searching and filtering of the games
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchbar");
  const clearSearchButton = document.getElementById("clear-search");
  const searchTermDisplay = document.getElementById("search-term");
  const searchRelatedDiv = document.getElementById("search-related");
  const suggestionList = document.getElementById("suggestion-list");
  if (!searchInput) return;
  searchRelatedDiv.style.display = "none";
  const updateSearchRelatedVisibility = (searchText) => {
    if (searchText.trim()) {
      searchRelatedDiv.style.display = "flex";
    } else {
      searchRelatedDiv.style.display = "none";
    }
  };
  //old code from script.js
  const searchList = (searchText) => {
    suggestionList.innerHTML = "";
    if (searchText.length === 0) {
      suggestionList.style.display = "none";
      return;
    }
    const filteredGames = Object.values(gamesData).filter(
      (game) =>
        game.gameTitle.toLowerCase().includes(searchText) ||
        game.gameUrl.toLowerCase().includes(searchText)
    );
    filteredGames.forEach((game) => {
      const li = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.href = `./Games/${game.gameUrl}`;
      anchor.target = "_blank";
      anchor.setAttribute("aria-label", game.gameTitle);
      anchor.textContent = game.gameTitle;
      li.appendChild(anchor);
      suggestionList.appendChild(li);
    });
    suggestionList.style.display = filteredGames.length ? "block" : "none";
  };
  //for searching
  searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.trim().toLowerCase();
    fetch("./assets/js/gamesData.json")
      .then((response) => response.json())
      .then((gamesData) => {
        const projectListContainer = document.querySelector(".project-list");
        projectListContainer.innerHTML = generateLiTags(gamesData, searchText);
        searchTermDisplay.textContent = searchInput.value;
        updateSearchRelatedVisibility(searchText);
        searchList(searchText);
      })
      .catch((error) => console.error("Error fetching game data:", error));
  });
  //for search clearing
  clearSearchButton.addEventListener("click", function () {
    searchInput.value = "";
    fetch("./assets/js/gamesData.json")
      .then((response) => response.json())
      .then((gamesData) => {
        const projectListContainer = document.querySelector(".project-list");
        projectListContainer.innerHTML = generateLiTags(gamesData);
        searchTermDisplay.textContent = "";
        updateSearchRelatedVisibility("");
        searchList("");
      })
      .catch((error) => console.error("Error fetching game data:", error));
  });
});

function like(button, tagNumber, gameData) {
  button.classList.toggle("liked");
  const isLiked = button.classList.contains("liked");
  
  // Store both liked state and game data in localStorage
  localStorage.setItem(`liked-${tagNumber}`, isLiked);
  localStorage.setItem(`game-${tagNumber}`, JSON.stringify(gameData));
}

