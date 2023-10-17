// Define the size of the aquarium
const aquarium = document.querySelector(".aquarium");
const aquariumWidth = window.innerWidth;
const aquariumHeight = window.innerHeight;

const infoBox = document.getElementById("info-box");
const settingsBox = document.getElementById("settings");
const settingsOpen = document.getElementById("settingsBtn");
const settingsClose = document.getElementById("settingsClose");
const hideInfo = document.getElementById("hide");
const roleContainerHider = document.getElementById("roleContainerHider");
const breedingDisabler = document.getElementById("breedingDisabler");
const shrimpSpawnController = document.getElementById("shrimpSpawn");
const agingDisabler = document.getElementById("agingDisabler");
const oldAgeDisabler = document.getElementById("oldAgeDisabler");
const hungerDisabler = document.getElementById("hungerDisabler");
const escapingDisabler = document.getElementById("disableEscaping");
const changeBg = document.getElementById("changeBg");

settingsOpen.addEventListener("click", () => {
  settingsBox.style.display = "flex";
});
settingsClose.addEventListener("click", () => {
  settingsBox.style.display = "none";
});

let updateInfo;
let isHidden = false;
let isFinished = false;
let activeBg = 1;

// World rules

let breeding = true;
let aging = true;
let deathByOldAge = true;
let energyConsumption = true;
let escaping = true;
let shrimpSpawner = true;

// Define the school of fish
const livingThings = [];

export const goodGenePool = [
  "healthy",
  "slow metabolism",
  "slow aging",
  "good vision",
  "agile",
];
export const badGenePool = [
  "sick",
  "fast metabolism",
  "fast aging",
  "bad vision",
  "bulky",
];

let shrimpSpawnRate = 2500;
// Define the Fish class
class Fish {
  constructor(
    svg,
    role,
    gender,
    size,
    speed,
    age,
    goodGenes,
    badGenes,
    generation
  ) {
    // Fish definitions
    this.svg = svg;
    this.role = role;
    this.gender = gender;
    this.intervals = [];
    this.isSelected = false;
    this.selectedGenes = [];
    this.goodGenePool = goodGenes;
    this.badGenePool = badGenes;
    this.species = this.svg.split(".")[0];
    this.generation = generation;
    this.isSick = false;

    // Select random genes from the gene pool

    const goodGeneIndex = Math.floor(Math.random() * this.goodGenePool.length);
    let badGeneIndex;
    do {
      badGeneIndex = Math.floor(Math.random() * this.badGenePool.length);
    } while (badGeneIndex === goodGeneIndex);
    this.selectedGenes.push(this.goodGenePool[goodGeneIndex]);
    this.selectedGenes.push(this.badGenePool[badGeneIndex]);

    if (speed < 5) {
      speed = speed + (Math.floor(Math.random() * 6) + 5);
    }

    this.size = size;
    this.age = age;
    this.state = "Wandering";
    this.mood = "healthy";
    this.baseSpeed = speed;
    this.isPregnant = false;
    this.hunger = 0;
    this.speed = speed;
    this.speedLock = false;
    this.breedLock = false;
    this.isExhausted = false;
    this.isAlive = true;
    this.agingFactor = 4500;
    this.hungerFactor = 4000;
    this.eyeSigth = Math.floor(Math.random() * 51) + 300;
    this.stamina = 200 + Math.floor(Math.random() * 11) + 10;
    this.maxStamina = this.stamina;
    this.canBreed = false;

    // Create the HTML element for the fish
    this.element = document.createElement("div");
    this.img = document.createElement("img");
    this.roleContainer = document.createElement("div");
    this.fishGender = document.createElement("span");

    // apply random % filter to the fish but not more than 60%
    this.img.style.filter = `grayscale(${Math.floor(Math.random() * 60)}%)`;

    // Set fish properties based on selectedGenes
    this.selectedGenes.forEach((gene) => {
      let randomStaminaVal = Math.floor(Math.random() * 31) + 70;
      switch (gene) {
        case "healthy":
          this.speed = speed;
          this.mood = "healthy";
          this.baseSpeed = this.speed;
          break;
        case "sick":
          this.speed = this.speed - Math.floor(Math.random() * 6);
          this.mood = "sick";
          this.isSick = true;
          this.baseSpeed = this.speed;
          break;
        case "fast metabolism":
          this.hungerFactor = this.hungerFactor - 3500;
          break;
        case "slow aging":
          this.agingFactor = this.agingFactor + 2000;
          break;
        case "slow metabolism":
          this.hungerFactor = this.hungerFactor + 2500;
          break;
        case "fast aging":
          this.agingFactor = this.agingFactor - 4000;
          break;
        case "bad vision":
          this.eyeSigth = this.eyeSigth - 250;
          break;
        case "good vision":
          this.eyeSigth = this.eyeSigth + 250;
          break;
        case "bulky":
          this.stamina = this.stamina - randomStaminaVal;
          this.maxStamina = this.maxStamina - randomStaminaVal;
          break;
        case "agile":
          this.stamina = this.stamina + randomStaminaVal;
          this.maxStamina = this.maxStamina + randomStaminaVal;
          break;
      }
    });
    this.lifeSpan = Math.floor(Math.random() * 11) + 40;

    // Create the HTML element for the fish role
    this.roleElement = document.createElement("span");
    this.roleElement.className = "role-item";

    switch (this.age) {
      case "baby":
        this.setPower(true);
        this.lifeTime = 1;
        break;
      case "adult":
        this.setPower(false);
        this.lifeTime = 13;
        break;
      case "elder":
        this.setPower(false);
        this.lifeTime = 40;
        break;
    }

    // Age fish
    this.agingInterval = setInterval(() => {
      if (aging) {
        this.lifeTime++;
        this.ageFish();
      }
    }, this.agingFactor);

    // Define the fish's hunger values
    this.hungerVal = Math.floor(Math.random() * 11) + 30;
    this.starvingVal = this.hungerVal + Math.floor(Math.random() * 11) + 10;
    this.deathVal = this.starvingVal + Math.floor(Math.random() * 11) + 30;
    this.intervals.push(this.agingInterval);

    // Increase hunger every 5 seconds if not a autotroph
    if (this.power > 0) {
      this.hungerInterval = setInterval(() => {
        this.setMood();
        if (energyConsumption) {
          this.hunger++;
          if (this.hunger > this.deathVal) {
            this.die(this, "natural");
          }
        }
      }, this.hungerFactor);
      this.intervals.push(this.hungerInterval);
    }

    // Randomly generate the initial position and direction of the fish
    this.x = Math.random() * aquariumWidth;
    this.y = Math.random() * aquariumHeight;
    this.angle = Math.random() * 360;

    // Set the speed and size of the fish
    this.speed = speed;
    this.screen = 40 + Math.random() * 40;

    // Create the HTML element for the fish

    this.fishState = document.createElement("span");
    this.fishState.innerText = this.state + " " + this.mood;
    this.fishState.className = "role-item";

    // Create img element for the fish

    this.img.src = "./assets/svg/animals/" + this.svg;
    if (this.age != "baby") {
      this.img.className = this.size;
    } else {
      this.img.className = "baby";
    }
    // add shadow to the fish
    this.element.appendChild(this.img);
    this.element.style.cursor = "pointer";
    this.element.className = "fish";
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}deg)`;

    // Add a red circle around the fish when it is clicked and remove other circles from other fish
    this.element.onclick = (e) => {
      killBtn.onclick = () => this.die(this, "natural");
      e.stopPropagation();
      if (this.isAlive) {
        if (isHidden) {
          this.roleContainer.style.display = "flex";
        }
        infoBox.style.display = "flex";
        clearInterval(updateInfo);
        updateFishInfo(this);
        livingThings.forEach((fish) => {
          fish.isSelected = false;
          fish.element.style.outline = "none";
          fish.element.style.outlineOffset = "none";
          fish.element.style.cursor = "pointer";
          fish.element.style.transform = `translate(${fish.x}px, ${fish.y}px) rotate(${fish.angle}deg)`;
        });
        this.isSelected = true;
        this.element.style.outline = "2px solid red";
        this.element.style.borderRadius = "50%";
        this.element.style.outlineOffset = "-2px";
        this.element.style.cursor = "default";
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}deg)`;
      }
    };
    // If clicked to the aquarium, remove the red circle around the fish
    aquarium.addEventListener("click", () => {
      infoBox.style.display = "none";
      if (isHidden) {
        this.roleContainer.style.display = "none";
      }
      this.isSelected = false;
      this.element.style.outline = "none";
      this.element.style.outlineOffset = "none";
      this.element.style.cursor = "pointer";
      this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}deg)`;
    });

    // Create role container

    this.roleContainer.className = "role-container";
    if (!isHidden) {
      this.roleContainer.style.display = "flex";
    } else {
      this.roleContainer.style.display = "none";
    }

    if (this.species != "shrimp") aquarium.appendChild(this.roleContainer);
    // Display fish gender on fish but do not rotate it with the fish

    this.fishGender.innerText = this.gender + " " + this.age;
    this.fishGender.className = "role-item";
    this.roleContainer.appendChild(this.roleElement);
    this.roleContainer.appendChild(this.fishGender);
    this.roleContainer.appendChild(this.fishState);

    // Add the fish to the aquarium
    aquarium.appendChild(this.element);
  }

  setState(status) {
    this.state = status;
    this.fishState.innerText = this.state + " " + this.mood;
  }

  setSpeed(speed, bypass) {
    if (this.speedLock || !bypass) {
      return;
    }
    this.speed = speed;
    this.speedLock = true;
  }

  // Aging function
  ageFish() {
    if (this.lifeTime >= this.lifeSpan && this.isAlive && deathByOldAge) {
      this.die(this, "natural");
    } else if (this.lifeTime >= 40) {
      this.age = "elder";
      this.fishGender.innerText = this.gender + " " + this.age;
      this.img.className = this.size;
    } else if (this.lifeTime >= 13) {
      this.age = "adult";
      this.fishGender.innerText = this.gender + " " + this.age;
      this.img.className = this.size;
      this.setPower();
    } else if (this.lifeTime >= 1) {
      this.age = "baby";
      this.img.className = "baby";
      this.fishGender.innerText = this.gender + " " + this.age;
    }
  }

  resetSpeed() {
    this.speed = this.baseSpeed;
    this.speedLock = false;
  }

  die(fish, cause) {
    livingThings.splice(livingThings.indexOf(fish), 1);
    let deathSize;
    if (fish.age == "baby") {
      deathSize = "baby";
    } else {
      deathSize = fish.size;
    }

    deathCount++;
    if (fish.isSelected) {
      infoBox.style.display = "none";
    }

    fish.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    fish.isAlive = false;
    const deadFish = document.createElement("div");
    const deadFishImg = document.createElement("img");
    if (cause == "natural") {
      deadFish.className = "fish";
      deadFishImg.src = "./assets/svg/env/dead.svg";
      deadFishImg.className = deathSize + " dead";
      setTimeout(() => {
        deadFish.remove();
      }, 20000);
    } else if (cause == "thanos") {
      deadFish.className = "fish snap-effect";
      deadFishImg.src = `/assets/svg/animals/${fish.species}.svg`;
      deadFishImg.className = deathSize + " dead";
      setTimeout(() => {
        deadFish.remove();
      }, 4000);
    }
    deadFish.appendChild(deadFishImg);
    deadFish.style.transform = `translate(${fish.x}px, ${fish.y}px) rotate(${fish.angle}deg)`;
    aquarium.appendChild(deadFish);
    fish.element.remove();
    fish.roleContainer.remove();
    fish.setSpeed(0, true);
  }
  setPower(override) {
    switch (this.size) {
      case "tiny":
        this.power = 0;
        this.nutritivity = 25;
        break;
      case "baby":
        this.power = 1;
        this.nutritivity = 30;
        break;
      case "small":
        this.nutritivity = 45;
        this.power = 2;
        break;
      case "medium":
        this.nutritivity = 55;
        this.power = 3;
        break;
      case "large":
        this.nutritivity = 80;
        this.power = 4;
        break;
    }
    if (override) {
      this.power = 1;
      this.nutritivity = 8;
    }
    this.roleElement.innerText = this.role + " " + this.power;
  }
  update() {
    // Update the position of the fish based on its current direction and speed
    const deltaX = this.speed * Math.cos((this.angle * Math.PI) / 180);
    const deltaY = this.speed * Math.sin((this.angle * Math.PI) / 180);
    const newX = this.x + deltaX;
    const newY = this.y + deltaY;
    const lerpX = lerp(this.x, newX, 0.1);
    const lerpY = lerp(this.y, newY, 0.1);
    this.x = lerpX;
    this.y = lerpY;

    const closestFish = this.getClosestFish();
    // If predator is close to prey, start chasing it
    if (this.mood == "hungry" || this.mood == "starving") {
      if (
        closestFish &&
        this.power > closestFish?.power &&
        this.svg != closestFish?.svg
      ) {
        const distance1 = Math.sqrt(
          Math.pow(this.x - closestFish.x, 2) +
            Math.pow(this.y - closestFish.y, 2)
        );

        if (distance1 < this.eyeSigth) {
          if (!this.isExhausted) {
            this.setState("Hunting");
          }
          this.angle = Math.atan2(
            closestFish.y - this.y,
            closestFish.x - this.x
          );
          this.angle = (this.angle * 180) / Math.PI;
        } else {
          if (!this.isExhausted) {
            this.setState("Wandering");
          }
        }
      }
    }
    // If prey is close to a predator, start running away

    if (
      escaping &&
      closestFish &&
      this.power < closestFish?.power &&
      this.svg != closestFish?.svg
    ) {
      const distance2 = Math.sqrt(
        Math.pow(this.x - closestFish.x, 2) +
          Math.pow(this.y - closestFish.y, 2)
      );
      if (distance2 < this.eyeSigth - 50) {
        if (!this.isExhausted) {
          this.setState("Escaping");
        }
        this.canBreed = false;
        this.angle = Math.atan2(this.y - closestFish.y, this.x - closestFish.x);
        this.angle = (this.angle * 180) / Math.PI;
      } else {
        this.setState("Wandering");
      }
    }

    // If predator and prey are close, eat prey
    if (
      closestFish &&
      this.power > closestFish.power &&
      (this.mood == "hungry" || this.mood == "starving")
    ) {
      const closestFish = this.getClosestFish();
      if (closestFish && this.svg != closestFish.svg) {
        const distance3 = Math.sqrt(
          Math.pow(this.x - closestFish.x, 2) +
            Math.pow(this.y - closestFish.y, 2)
        );
        if (distance3 < 50) {
          this.hunger -= closestFish.nutritivity;
          // If selectedGenes has sick gene, set mood to sick otherwise set to healthy
          this.setMood();
          this.setState("Wandering");
          this.resetSpeed();
          this.die(closestFish, "natural");
        }
      }
    }

    // If canBreed is true, look for a mate and chase it
    if (
      breeding &&
      this.canBreed &&
      this.size != "tiny" &&
      closestFish?.canBreed &&
      !this.breedLock &&
      this.mood != "starving" &&
      this.mood != "hungry"
    ) {
      this.setState("Looking for mate");
      if (
        closestFish &&
        this.svg == closestFish.svg &&
        this != closestFish &&
        closestFish.age != "baby" &&
        this.gender != closestFish.gender
      ) {
        const distance4 = Math.sqrt(
          Math.pow(this.x - closestFish.x, 2) +
            Math.pow(this.y - closestFish.y, 2)
        );
        if (Math.round(distance4) < Math.round(this.eyeSigth + 1250)) {
          this.angle = Math.atan2(
            closestFish.y - this.y,
            closestFish.x - this.x
          );
          this.angle = (this.angle * 180) / Math.PI;

          if (
            distance4 < 50 &&
            closestFish.canBreed &&
            !this.breedLock &&
            (closestFish.state == "Looking for mate" ||
              closestFish.state == "Breeding")
          ) {
            this.breed(closestFish);
          }
        } else {
          if (!this.isExhausted) {
            this.setState("Wandering");
          }
        }
      }
    }

    // Wrap the fish around the edges of the screen if it goes out of bounds
    if (this.x < -this.screen) {
      this.x = window.innerWidth + this.screen;
    } else if (this.x > window.innerWidth + this.screen) {
      this.x = -this.screen;
    }
    if (this.y < -this.screen) {
      this.y = window.innerHeight + this.screen;
    } else if (this.y > window.innerHeight + this.screen) {
      this.y = -this.screen;
    }

    // Make role element follow the fish on top of the fish but not rotate with it
    this.roleContainer.style.transform = `translate(${this.x}px, ${this.y}px) rotate(0deg)`;

    // Update the position and orientation of the fish element on the page
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}deg)`;
  }

  // Set mood
  setMood() {
    let defaultMood;
    if (this.isPregnant) {
      defaultMood = "pregnant";
    } else if (this.selectedGenes.includes("sick")) {
      defaultMood = "sick";
    } else {
      defaultMood = "healthy";
    }
    if (this.hunger > this.hungerVal) {
      this.canBreed = false;
      this.mood = "hungry";
    }
    if (this.hunger > this.starvingVal) {
      this.canBreed = false;
      this.mood = "starving";
    }
    if (this.hunger < this.hungerVal) {
      if (this.age != "baby") {
        this.canBreed = true;
      }
      this.mood = defaultMood;
    }
    this.fishState.innerText = this.state + " " + this.mood;
  }

  breed(fish) {
    this.setSpeed(0, true);
    this.breedLock = true;
    setTimeout(() => {
      this.setState("Wandering");
      this.resetSpeed();

      if (this.gender == "female") {
        this.setMood();
        this.giveBirth(fish);
      } else {
        this.breeedLock = true;
        this.canBreed = false;
      }
    }, 3000);
    this.setState("Breeding");
  }

  // Get closest fish
  getClosestFish() {
    let closestFish = null;
    let closestDistance = null;
    livingThings.forEach((fish) => {
      if (fish === this) return;
      const distance = Math.sqrt(
        Math.pow(this.x - fish.x, 2) + Math.pow(this.y - fish.y, 2)
      );
      if (closestDistance === null || distance < closestDistance) {
        closestFish = fish;
        closestDistance = distance;
      }
    });
    return closestFish;
  }

  increaseStamina() {
    if (this.stamina <= this.maxStamina) {
      this.stamina += 1;
    }
  }
  decreaseStamina() {
    if (this.stamina >= 0) {
      this.stamina -= 1;
    }
  }

  giveBirth(father) {
    // Give a random number for pregnancy time
    let pregnancyTime = Math.floor(Math.random() * 10000) + 10000;
    this.isPregnant = true;
    this.canBreed = false;
    this.breedLock = true;
    if (this.isPregnant) {
      this.setMood();
      this.pregnancyInterval = setTimeout(() => {
        this.setState("Wandering");
        this.resetSpeed();

        // Create 10 or less babies
        let babyCount = Math.floor(Math.random() * 20);
        if (this.isSick) {
          babyCount = babyCount - (Math.floor(Math.random() * 6) + 5);
        }
        if (babyCount <= 0) {
          babyCount = babyCount + (Math.floor(Math.random() * 6) + 5);
        }

        // Get current alive count of this kind
        let currentCount = 0;
        livingThings.forEach((fish) => {
          if (fish.svg == this.svg) {
            currentCount++;
          }
        });

        if (currentCount + babyCount > 100) {
          babyCount = 5;
        }

        for (let i = 0; i < babyCount; i++) {
          const baby = createAnimal(
            this.svg,
            this.role,
            getRandomGender(),
            this.size,
            Math.floor(Math.random() * 11) + 10,
            "baby",
            this.selectedGenes,
            father.selectedGenes,
            this.generation + 1
          );

          // put baby near mother
          baby.x = this.x + 10;
          baby.y = this.y + 10;
        }

        this.isPregnant = false;
      }, pregnancyTime);
      this.intervals.push(this.pregnancyInterval);
    }
  }

  turn() {
    // Randomly change the direction of the fish smoothly over time
    const turnAngle = Math.random() * 8 - 4;
    this.angle += turnAngle;
  }

  fishController() {
    if (this.state == "Wandering") {
      this.resetSpeed();
    }
    if (this.state == "Hunting" || this.state == "Escaping") {
      this.decreaseStamina();
      if (this.stamina == 0) {
        this.isExhausted = true;
        this.setState("Exhausted");
        this.setSpeed(this.speed - 5, true);
      }
    }
    if (
      this.state == "Exhausted" ||
      this.state == "Wandering" ||
      this.state == "Looking for mate"
    ) {
      this.increaseStamina();
      if (this.stamina == this.maxStamina) {
        this.isExhausted = false;
        this.setState("Wandering");
        this.resetSpeed();
      }
    }
  }

  live() {
    this.update();
    this.turn();
    this.fishController();
  }
}
export const createAnimal = (
  svg,
  role,
  gender,
  size,
  speed,
  age,
  goodGenes,
  badGenes,
  generation
) => {
  const fish = new Fish(
    svg,
    role,
    gender,
    size,
    speed,
    age,
    goodGenes,
    badGenes,
    generation
  );
  livingThings.push(fish);
  return fish;
};
function getRandomGender() {
  let gender;
  const random = Math.random();
  if (random < 0.5) {
    gender = "female";
  } else {
    gender = "male";
  }
  return gender;
}
// Instantiate elements for infos
const speciesInfo = document.getElementById("species");
const generationInfo = document.getElementById("generation");
const genInfo = document.getElementById("genes");
const ageInfo = document.getElementById("age");
const hungerInfo = document.getElementById("hunger");
const speedInfo = document.getElementById("speed");
const staminaInfo = document.getElementById("stamina");
const killBtn = document.getElementById("kill-fish");
hideInfo.addEventListener("click", () => {
  infoBox.style.display = "none";
  clearInterval(updateInfo);
});
const updateFishInfo = (fish) => {
  let canStarve = true;
  if (fish.power == 0) {
    canStarve = false;
  }
  // Create interval to update info
  updateInfo = setInterval(() => {
    speciesInfo.innerText = "Species: " + fish.species;
    generationInfo.innerText = "Generation: " + fish.generation;
    genInfo.innerText = "Genes: " + fish.selectedGenes;
    ageInfo.innerText = "Age: " + fish.lifeTime;
    if (!canStarve) {
      hungerInfo.innerText =
        "Hunger: " + fish.hunger + " (shrimps eat dead plants)";
    } else {
      hungerInfo.innerText = "Hunger: " + fish.hunger;
    }
    speedInfo.innerText = "Speed: " + fish.speed;
    staminaInfo.innerText = "Stamina: " + fish.stamina;
  }, 100);
};

let deathCount = 0;

function lerp(start, end, amount) {
  return (1 - amount) * start + amount * end;
}

function hideContainers(value) {
  const _containers = document.querySelectorAll(".role-container");
  _containers.forEach((container) => {
    if (value) {
      isHidden = true;
      container.style.display = "none";
    } else {
      isHidden = false;
      container.style.display = "flex";
    }
  });
}

roleContainerHider.addEventListener("change", (e) => {
  const label = e.target.nextElementSibling;
  if (roleContainerHider.checked) {
    hideContainers(true);
    label.innerText = "Show Role Containers";
  } else {
    hideContainers(false);
    label.innerText = "Hide Role Containers";
  }
});
breedingDisabler.addEventListener("change", (e) => {
  const label = e.target.nextElementSibling;
  if (breedingDisabler.checked) {
    label.innerText = "Enable Breeding";
    breeding = false;
    livingThings.forEach((fish) => {
      fish.setState("Wandering");
    });
  } else {
    breeding = true;
    label.innerText = "Disable Breeding";
  }
});
shrimpSpawnController.addEventListener("change", (e) => {
  const label = e.target.nextElementSibling;
  if (shrimpSpawnController.checked) {
    shrimpSpawner = false;
    label.innerText = "Enable Shrimp Spawn";
  } else {
    shrimpSpawner = true;
    label.innerText = "Disable Shrimp Spawn";
  }
});
agingDisabler.addEventListener("change", (e) => {
  const label = e.target.nextElementSibling;
  if (agingDisabler.checked) {
    aging = false;
    label.innerText = "Enable Aging";
  } else {
    aging = true;
    label.innerText = "Disable Aging";
  }
});
changeBg.addEventListener("click", () => {
  if (activeBg == 1) {
    activeBg = 2;
    changeBg.innerText = "Change Background: 2";
    document.body.style.background =
      "url(/assets/imgs/bg-2.png) no-repeat center center";
  } else {
    activeBg = 1;
    changeBg.innerText = "Change Background: 1";
    document.body.style.background =
      "url(/assets/imgs/bg-1.png) no-repeat bottom center";
  }
});
oldAgeDisabler.addEventListener("change", (e) => {
  const label = e.target.nextElementSibling;
  if (oldAgeDisabler.checked) {
    deathByOldAge = false;
    label.innerText = "Enable Death by Old Age";
  } else {
    deathByOldAge = true;
    label.innerText = "Disable Death by Old Age";
  }
});
hungerDisabler.addEventListener("change", (e) => {
  const label = e.target.nextElementSibling;
  if (hungerDisabler.checked) {
    energyConsumption = false;
    label.innerText = "Enable Hunger";
  } else {
    energyConsumption = true;
    label.innerText = "Disable Hunger";
  }
});
escapingDisabler.addEventListener("change", (e) => {
  const label = e.target.nextElementSibling;
  if (escapingDisabler.checked) {
    escaping = false;
    label.innerText = "Enable Horror";
  } else {
    escaping = true;
    label.innerText = "Disable Horror";
  }
});
// Randomly spawn shrimp every 10 seconds with a random speed and gender
const shrimpSpeed = Math.floor(Math.random() * 6) + 5;
if (shrimpSpeed < 5) {
  shrimpSpeed = shrimpSpeed + (Math.floor(Math.random() * 6) + 5);
}

setInterval(() => {
  if (shrimpSpawner) {
    createAnimal(
      "shrimp.svg",
      "prey",
      getRandomGender(),
      "tiny",
      shrimpSpeed,
      "adult",
      goodGenePool,
      badGenePool,
      1
    );
  }
}, shrimpSpawnRate);

// Create Animal BTNs

const createAnimalBtn = document.getElementById("create-animal");
createAnimalBtn.addEventListener("click", () => {
  const genderSelect = document.querySelector("#gender");
  const gender = genderSelect.value;
  const animalSelect = document.querySelector("#kind");
  const species = animalSelect.value;
  switch (species) {
    case "piranha":
      createAnimal(
        "piranha.svg",
        "predator",
        gender,
        "small",
        Math.floor(Math.random() * 11) + 10,
        "adult",
        goodGenePool,
        badGenePool,
        1
      );
      break;
    case "shark":
      createAnimal(
        "shark.svg",
        "predator",
        gender,
        "large",
        Math.floor(Math.random() * 11) + 10,
        "adult",
        goodGenePool,
        badGenePool,
        1
      );
      break;
    case "goldenfish":
      createAnimal(
        "goldenfish.svg",
        "prey",
        gender,
        "small",
        Math.floor(Math.random() * 11) + 10,
        "adult",
        goodGenePool,
        badGenePool,
        1
      );
      break;
    case "seahorse":
      createAnimal(
        "seahorse.svg",
        "prey",
        gender,
        "small",
        Math.floor(Math.random() * 11) + 10,
        "adult",
        goodGenePool,
        badGenePool,
        1
      );
      break;
    case "dolphin":
      createAnimal(
        "dolphin.svg",
        "prey",
        gender,
        "medium",
        Math.floor(Math.random() * 11) + 10,
        "adult",
        goodGenePool,
        badGenePool,
        1
      );
      break;
    case "octopus":
      createAnimal(
        "octopus.svg",
        "predator",
        gender,
        "medium",
        Math.floor(Math.random() * 11) + 10,
        "adult",
        goodGenePool,
        badGenePool,
        1
      );
      break;
    case "angler":
      createAnimal(
        "angler.svg",
        "predator",
        gender,
        "medium",
        Math.floor(Math.random() * 11) + 10,
        "adult",
        goodGenePool,
        badGenePool,
        1
      );
      break;
    case "clown":
      createAnimal(
        "clown.svg",
        "prey",
        gender,
        "small",
        Math.floor(Math.random() * 11) + 10,
        "adult",
        goodGenePool,
        badGenePool,
        1
      );
      break;
    case "balloon":
      createAnimal(
        "balloon.svg",
        "prey",
        gender,
        "small",
        Math.floor(Math.random() * 11) + 10,
        "adult",
        goodGenePool,
        badGenePool,
        1
      );
      break;
    case "turtle":
      createAnimal(
        "turtle.svg",
        "prey",
        gender,
        "small",
        Math.floor(Math.random() * 11) + 10,
        "adult",
        goodGenePool,
        badGenePool,
        1
      );
      break;
  }
});

// Create Animal BTNs

let predators;
let preys;

function thanosSnap() {
  // Play audio
  const audio = new Audio("/assets/audio/snap.mp3");
  audio.play();
  // Select half of the living things randomly
  const half = Math.floor(livingThings.length / 2);
  const halfOfLivingThings = livingThings
    .sort(() => 0.5 - Math.random())
    .slice(0, half);

  halfOfLivingThings.forEach((fish) => {
    fish.die(fish, "thanos");
  });
}

document.querySelector("#thanos-snap-btn").addEventListener("click", () => {
  thanosSnap();
});

let _speciesCount;
let uniqueSpecies;
let lastStanding;
// Update preys and predators arrays every .5 seconds
setInterval(() => {
  predators = livingThings.filter((fish) => fish.role === "predator");
  predators = predators.length;
  preys = livingThings.filter((fish) => fish.role === "prey");
  preys = preys.length;

  uniqueSpecies = new Set(livingThings.map((fish) => fish.species));

  // Get the count of unique species
  _speciesCount = new Set(
    [...uniqueSpecies].filter((species) => species !== "shrimp")
  );

  // If species count is 1, then finish the game
  if (_speciesCount.size == 1) {
    if (!isFinished) {
      isFinished = true;
      lastStanding = [..._speciesCount][0];
      if (
        confirm(
          `Simulation is over! All species except for ${lastStanding} have gone extinct! Do you want to start a new simulation?`
        )
      ) {
        window.location.reload();
      }
    }
  }

  document.getElementById("living-count").innerText =
    "Preys: " + preys + " " + "Predators: " + predators;
  document.getElementById("dead-count").innerText = "Deaths: " + deathCount;
}, 500);

// Update the position and direction of each fish every frame
requestAnimationFrame(function update() {
  livingThings.forEach((fish) => {
    fish.live();
  });
  requestAnimationFrame(update);
});
