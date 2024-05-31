// Generate <li> tags dynamically
const generateLiTags = (gamesData) => {
  const liTags = [];

  for (let tagNumber = 1; tagNumber <= 385; tagNumber++) {
    const gameData = gamesData[tagNumber.toString()];

    if (gameData) {
      const { gameTitle, gameUrl, thumbnailUrl } = gameData;

      const liTag = `
          <li class="project-item active" data-filter-item data-category="open source">
            <a href="./Games/${gameUrl}" target = "_blank" aria-label=${gameTitle}>
              <figure class="project-img">
                <div class="project-item-icon-box">
                  <img id="joystick" src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png" alt="Eye" width="3" />
                </div>
                <img src="./assets/images/${thumbnailUrl}" alt="${gameTitle}" loading="lazy">
              </figure>
              <h3 class="project-title"><a href="https://github.com/kunjgit/GameZone/tree/main/Games/${gameUrl}" target="_blank" aria-label=${gameTitle}>${tagNumber}. ${gameTitle} 🔗</a></h3>
              </a>
              </li>
              `;

      liTags.push(liTag);
    }
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

// Add a click event listener to the div
searchContainer.addEventListener("click", function () {
  // Focus on the input field when the div is clicked
  searchInput.focus();
});
