const typeColors = {
  rock: "#BBAB67",
  ghost: "#6767BB",
  steel: "#AAABBA",
  water: "#3398FE",
  grass: "#50a425",
  psychic: "#FE5499",
  ice: "#67CCFE",
  dark: "#775544",
  fairy: "#EF99EF",
  normal: "#A9A998",
  fighting: "#C12239",
  flying: "#8898FE",
  poison: "#AB5499",
  ground: "#DCBB54",
  bug: "#ABBA22",
  fire: "#FF4422",
  electric: "#dfb624",
  dragon: "#7667EE",
};
const statsData = {
  hp: "HP",
  attack: "ATK",
  defense: "DEV",
  "special-attack": "SATK",
  "special-defence": "SDEF",
  speed: "SPD",
};

let card = document.querySelector("#card");
let name = document.querySelector("#name");
let id = document.querySelector("#id");
let sprite = document.querySelector(".sprite");
let typeBox = document.getElementById("type-box");
let weight = document.querySelector(".weight");
let height = document.querySelector(".height");
let ability = document.querySelector(".ability");
let barColor = document.querySelectorAll(".inner-bar");
let highlightedText = document.querySelectorAll(".highlighted-text");
let pkmonTheme = document.querySelector(":root");
let hp = document.querySelector(".hp");
let abilities = document.querySelector(".abilities");
let type2 = document.getElementById("unique2");
let abilityBox = document.querySelector(".abilities-box");
pokemonData(1)

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function pokemonData(pkmon) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pkmon}`;
  let response = await fetch(url);
  console.log(response);
  if(response.status ==404){
    alert("The Pokemon name or id doesn't exist")
  }
  let data = await response.json();

  let typeHTML = ``;
  let abilityHTML = ``;
  name.innerHTML = capitalizeFirstLetter(data.name);

  //About details
  id.innerHTML = `#${data.id.toString().padStart(3, "0")}`;
  height.innerHTML = `${Number(data.height) / 10} m`;
  weight.innerHTML = `${Number(data.weight) / 10} kg`;
  sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
  // changing the card theme
  let typeColor = typeColors[data.types[0].type.name];
  pkmonTheme.style.setProperty("--Pokemon-Type-Theme", `${typeColor}`);
  if (data.types.length > 1) {
    //type coloring
    let type2Color = typeColors[data.types[1].type.name];
    pkmonTheme.style.setProperty(
      "--Pokemon-Type-Type-2-Theme",
      `${type2Color}`
    );
  }
  data.types.forEach((e, index) => {
    let typeName = e.type.name;
    typeHTML += `<div class="type${index + 1}" id="unique${
      index + 1
    }" >${capitalizeFirstLetter(typeName)}</div>`;
  });
  typeBox.innerHTML = typeHTML;

  data.abilities.forEach((e) => {
    abilityHTML += `<h4 class="abilities">${capitalizeFirstLetter(
      e.ability.name
    )}</h4>`;
  });
  abilityBox.innerHTML = abilityHTML;

  //stats bar
  data.stats.forEach( async e=>{
    let statName= await e.stat.name
    let statQty=document.querySelector(`.${statName}`);
    statQty.textContent=  `${e['base_stat'].toString().padStart(3, "0")}`;
    console.log(statQty);
    let innerBar= document.querySelector(`.${statName}-bar`);
    innerBar.style.width=e['base_stat']>100?"100%" :`${e['base_stat']}%`
  })
}

document.querySelector('.random').addEventListener('click', ()=>{
  pokemonData(Math.floor(Math.random() * 1011));

})

let getPokemon = document.getElementById("getPokemon");
getPokemon.addEventListener("click", () => {
  search();
  document.querySelector(".searchPokemon").value="";


});
window.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    search();
    document.querySelector(".searchPokemon").value="";

  }
});
function search() {
  let searchName = document.querySelector(".searchPokemon").value;
  searchName = searchName.toLowerCase();
  pokemonData(searchName);
}


document.getElementById('left').addEventListener('click',()=>{
  next(-1)
})
document.getElementById('right').addEventListener('click',()=>{
  next(1)
})
function next(a){
  let idNumber= Number(id.innerHTML.substring(1));
  if((idNumber==1 && a>0) || idNumber!=1){
    idNumber+=a;
    pokemonData(idNumber)
  }
}