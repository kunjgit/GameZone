let namePrefixList = {
  elf: [
    "Ara",
    "Elis",
    "Karo",
    "Lego",
    "Pali",
    "Ria",
    "Sil",
    "Cyl",
    "Lara",
    "Lego",
    "Lilis",
    "Min",
    "Phy",
    "Rilli",
    "Sil",
    "Ur",
  ],
  dwarf: [
    "B",
    "Bal",
    "D",
    "Dal",
    "Dor",
    "Kil",
    "Mor",
    "Ov",
    "Thor",
    "Nal",
    "Thr",
  ],
  orc: [
    "Bar",
    "Bo",
    "Dur",
    "Mur",
    "Na",
    "Ya",
    "Sha",
    "Shu",
    "Yar",
    "Du",
    "Gro",
    "Ur",
  ],
  human: [
    "Andre",
    "Astien",
    "Daric",
    "Ernand",
    "Arniel",
    "Renald",
    "Lucien",
    "Thomas",
    "Delphine",
    "Mirabelle",
    "Vivienne",
    "Luciana",
  ],
};

let nameSuffixList = {
  elf: [
    "dell",
    "driel",
    "gorn",
    "las",
    "nis",
    "nor",
    "dra",
    "fina",
    "gina",
    "landra",
    "lerva",
    "nia",
    "sandra",
  ],
  dwarf: ["im", "aim", "in", "ain", "ar", "or", "ur", "o", "i", "ak"],
  orc: [
    "kul",
    "zog",
    "gob",
    "groth",
    "garg",
    "log",
    "bagg",
    "gash",
    "grolg",
    "gorkh",
    "zok",
    "zarth",
  ],
  human: [
    "Beaufort",
    "Dufond",
    "Petit",
    "Rielle",
    "Motierre",
    "Lachance",
    "Bienne",
    "Herrick",
  ],
};

function combineName(race) {
  // Merge prefix and suffixe from race
  return `${getRandomItem(namePrefixList[race])}${
    race == "human" ? " " : ""
  }${getRandomItem(nameSuffixList[race])}`;
}

function generateName(race) {
  let name = combineName(race);
  // Dwarves got 2 names
  if (race == "dwarf") {
    name += ` ${combineName(race)}`;
  }
  if (race == "orc") {
    name += ` ${getRandomItem(["gro-", "gra-"])}${combineName(race)}`;
  }
  return name;
}
