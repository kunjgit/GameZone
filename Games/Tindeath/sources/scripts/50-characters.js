function addCharacter() {
  characterList.push(generateCharacter());
  let $card = generateCharacterCard(characterList[currentCardIndex++]);

  // Insert new card first
  $cardList.insertBefore($card, $cardList.firstChild);
}

// Generate a new character with all his infos
function generateCharacter() {
  let isSpecificTutorialCard = currentTutorialStep && currentCardIndex === 1;
  let race = isSpecificTutorialCard ? raceList[3] : getRandomItem(raceList);
  let character = {
    race: race.name,
    name: generateName(race.name),
    deathCause: getRandomItem(deathCauseList),
    height: getRandomGaussian(race.minHeight * 10, race.maxHeight * 10) / 10,
    weight: getRandomGaussian(race.minWeight, race.maxWeight),
    age: getRandomGaussian(race.minAge, race.maxAge),
  };
  // Set a random element for every part
  Object.keys(customizationList).forEach((part) => {
    let partNumber = getRandomNumber(0, customizationList[part].length - 1);
    character[part] = customizationList[part][partNumber];
    character[part + "Col"] =
      colorList[part][getRandomNumber(0, colorList[part].length - 1)];
  });

  // Set specific changes for races
  if (character.race == "orc") {
    character.faceCol = getRandomItem(characterOrcFaceColorList);
  }
  if (character.race == "elf") {
    character.faceCol = getRandomItem(characterElfFaceColorList);
    character.ear = elfEars;
  }
  if (character.race == "orc") {
    character.mouth = orcMouth;
  }
  // Removes wrinkles if character is not old
  if (character.age < race.maxAge - (race.maxAge - 42) * 0.3) {
    character.wrinkles = [];
  }

  // Adds error randomly. For tutorial set second card on error only
  if (isSpecificTutorialCard) {
    // Change character race for human
    character.error = {
      race: raceList[0].name,
    };
  } else if (!currentTutorialStep) {
    // No error during first card of tutorial
    addRandomError(character);
  }

  // Sets ear color like skin color, after error is set, has it can change
  character["earCol"] = character["faceCol"];
  character["eyebrowCol"] = character["hairCol"];
  character["beardCol"] = character["hairCol"];

  return character;
}

// Adds some errors to character randomly
function addRandomError(character) {
  let characterRace = character.race;
  let error;
  // If player has a higher score, adds some new more difficult errors
  let hasHighScore = score > 15;

  // Change character race
  if (random() < 0.35) {
    // Switch elf/orc to human/dwarf or opposite, to avoid confusions
    var newRace =
      ["elf", "orc"].indexOf(character.race) >= 0
        ? raceList[getRandomNumber(0, 1)]
        : raceList[getRandomNumber(2, 3)];

    character.error = {
      race: newRace.name,
      m: `a ${characterRace} looking like ${newRace.name}`,
    };
  }

  // Change height for elf/dwarfs
  if (characterRace == "dwarf" && random() < 0.25) {
    error = {
      height: getRandomGaussian(1.8, 2.4),
      m: `a Dwarf taller than 1.5m`,
    };
  }
  if (characterRace == "elf") {
    if (random() < 0.25) {
      error = {
        height: getRandomGaussian(1, 1.4),
        m: `an Elf smaller than 1.9m`,
      };
    } else if (random() < 0.25) {
      // Change elf ears
      error = {
        ear: getRandomItem(customizationList["ear"]),
        m: `an Elf without pointy ears`,
      };
    }
    if (hasHighScore && random() < 0.2) {
      // Change elf weight
      error = {
        weight: getRandomGaussian(100, 120),
        m: `an Elf weigh more than 100kg`,
      };
    }
  } else {
    // Set elf ears to other races (not orc, as in some fantasy they got ears like elves)
    if (characterRace != "orc" && random() < 0.25) {
      error = {
        ear: elfEars,
        m: `a ${characterRace} with pointy ears`,
      };
    }
    if (hasHighScore && characterRace == "orc" && random() < 0.2) {
      // Change orc weight
      error = {
        weight: getRandomGaussian(50, 70),
        m: `an Orc weigh less than 80kg`,
      };
    }
    // Change age
    if (hasHighScore && characterRace == "human" && random() < 0.25) {
      error = {
        age: getRandomNumber(160, 230),
        m: `a ${characterRace} older than 150 years`,
      };
    }

    // Change skin color for orc/not orc
    if (hasHighScore && random() < 0.2) {
      let skinColor = getRandomItem(
        ["orc", "elf"].indexOf(characterRace) >= 0
          ? colorList.face
          : characterOrcFaceColorList.concat(characterElfFaceColorList)
      );
      error = {
        faceCol: skinColor,
        earCol: skinColor,
        m: `a ${characterRace} with this skin color`,
      };
    }
  }

  // Change character name
  if (hasHighScore && random() < 0.2) {
    // Get random race other than current one
    let raceList = ["orc", "elf", "human", "dwarf"];
    raceList.splice(raceList.indexOf(characterRace), 1);
    let newName = generateName(getRandomItem(raceList));
    error = {
      name: newName,
      m: `a ${characterRace} named ${newName}`,
    };
  }

  // If character is old, change character death reason to "old age"
  if (random < 0.6 && character.wrinkles.length) {
    character.deathCause = "old Age";
    // And sometimes change age to a young one, introducing error
    if (hasHighScore && random < 0.5) {
      let maxAge = characterRace == "elf" ? 120 : 55;
      let newAge = getRandomNumber(40, maxAge); // Not gaussian here
      error = {
        age: newAge,
        m: `a ${characterRace} dying from old age at ${newAge}`,
      };
    }
  }

  character.error = error;
}

function drawCharacterFace(character) {
  // Clothes, always same pattern
  // TODO: surement simplifier le "326, 305" redondant
  let characterFace = `
  ${createSvg(326, 305, [
    {
      d: "M116.7 214.8a61.7 61.7 0 0 1 46-19.3c18.8 0 35.4 7.6 46 19.3a40.3 40.3 0 0 1 34.6 39.7V305H82v-50.5a40.3 40.3 0 0 1 34.7-39.7Z",
      fill: `#${character.clothesCol}`,
    },
  ])}`;

  // Draws every body parts, loop on all parts typa available
  Object.keys(customizationList).forEach((part) => {
    // Draw every path of the part
    for (var pathIndex in character[part]) {
      let color =
        part == "mouth"
          ? "transparent"
          : pathIndex < 1 || part == "eye"
          ? `#${character[part + "Col"]}`
          : "rgba(0, 0 ,0, 0.1)";
      let pathProperties = { fill: color };
      if (character[part][pathIndex]) {
        if (character[part][pathIndex].startsWith("M")) {
          pathProperties.d = character[part][pathIndex];
        } else {
          pathProperties = Object.assign(
            pathProperties,
            JSON.parse(character[part][pathIndex])
          );
        }
        characterFace += createSvg(326, 305, [pathProperties]);
      }
    }
  });

  return characterFace;
}
