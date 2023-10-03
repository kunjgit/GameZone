// Generate <li> tags dynamically
const generateLiTags = gamesData => {
  const liTags = [];

  for (let tagNumber = 1; tagNumber <= 286; tagNumber++) {
    const gameData = gamesData[tagNumber.toString()];

    if (gameData) {
      const { gameTitle, gameUrl, thumbnailUrl } = gameData;
      const isGameFavourite = JSONParse(getItem('favourites'))?.find(game => game.gameUrl === gameUrl)

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
              <p class="project-category">Play and have fun!</p>
            </a>
            <div class="favouriteIconWrapper">
              <img src="./assets/images/${isGameFavourite ? 'favourite-filled' : 'favourite'}.png" alt="favourite-icon" class="favouriteIcon" id=${gameUrl} />
            </div>
          </li>
        `;

      liTags.push(liTag);
    }
  }

  return liTags.join('\n');
};

let isFavourites = false

// Fetch the game data from the JSON file
fetch('./assets/js/gamesData.json')
  .then(response => response.json())
  .then(gamesData => {
    const projectListContainer = document.querySelector('.project-list');
    projectListContainer.innerHTML = generateLiTags(gamesData);
    const allIcons = document.getElementsByClassName('favouriteIcon')
    for (let i = 0; i < allIcons.length; i++) {
      allIcons[i].addEventListener('click', favouriteHandler)
    }
    getPageNumbers();
    getProjectsInPage();
    document.querySelector('.favorites').addEventListener('click', fetchFavourites)
  })
  .catch(error => console.error('Error fetching game data:', error));

window.addEventListener('scroll', function() {
  var scrollToTopButton = document.getElementById('progress');
  if (window.pageYOffset > 200) {
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
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

const favouriteHandler = (e) => {
  fetch('./assets/js/gamesData.json')
    .then(response => response.json())
    .then(gamesData => {
      const gamesArray = Array.from(Object.values(gamesData))

      if (!getItem('favourites')) {
        const clickedGame = gamesArray.filter(game => game.gameUrl === e.target.id)
        setItem(JSONStringify(clickedGame))
        imageSrcUpdate(e.target.id, 'favourite-filled')
      } else {
        const isGameFavourite = JSONParse(getItem('favourites')).find(game => game.gameUrl === e.target.id)
        if (isGameFavourite) {
          const clickedGame = JSONParse(getItem('favourites')).filter(game => game.gameUrl !== e.target.id)
          setItem(JSONStringify(clickedGame))
          imageSrcUpdate(e.target.id, 'favourite')
        } else {
          const clickedGame = gamesArray.find(game => game.gameUrl === e.target.id)
          setItem(JSONStringify([...JSONParse(getItem('favourites')), clickedGame]))
          imageSrcUpdate(e.target.id, 'favourite-filled')
        }
      }
    }
  )
}

const imageSrcUpdate = (id, type) => {
  const newImageUrl = document.getElementById(id).src.split('/')
  newImageUrl[5] = `${type}.png`
  newImageUrl.join('/')
  document.getElementById(id).src = newImageUrl.join('/')
}

const fetchFavourites = () => {
  isFavourites = !isFavourites
  fetch('./assets/js/gamesData.json')
    .then(response => response.json())
    .then(gamesData => {
      const gamesArray = Array.from(Object.values(gamesData))
      if (isFavourites) {
        const favorites = JSONParse(getItem('favourites'))

        const finalGamesToRender = Object.assign({}, gamesArray.map(game => {
          if (favorites.find(el => el.gameUrl === game.gameUrl)) {
            return game
          }
        }).filter(game => game))
        
        // to update the indexing from 0 to 1
        const updatedJSON = {};
        Object.keys(finalGamesToRender).forEach(key => {
          const newIndex = parseInt(key) + 1;
          updatedJSON[newIndex] = finalGamesToRender[key];
        });

        favoritesUpdate(updatedJSON)
      } else {
        favoritesUpdate(gamesData)
      }
    })  
}

const favoritesUpdate = (data) => {
  const projectListContainer = document.querySelector('.project-list');
  projectListContainer.innerHTML = generateLiTags(data);
  getPageNumbers();
  getProjectsInPage();

  const allIcons = document.getElementsByClassName('favouriteIcon')
  for (let i = 0; i < allIcons.length; i++) {
    allIcons[i].addEventListener('click', favouriteHandler)
  }
}

const getItem = () => {
  return localStorage.getItem('favourites')
}
const setItem = (data) => {
  return localStorage.setItem('favourites', data)
}

const JSONParse = (data) => {
  return JSON.parse(data)
}
const JSONStringify = (data) => {
  return JSON.stringify(data)
}