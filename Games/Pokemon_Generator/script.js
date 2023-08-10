//https://pokeapi.co/api/v2/pokemon/5
let contenedor;
const total_pokemons = 500;

window.onload = inicio;

function aleatorio(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function inicio()
{
  contenedor = document.getElementById("vitrina");
  window.addEventListener("click",pintarVitrina);
}

function pintarVitrina(evento){
  contenedor.innerHTML = "";
  traerDatos(aleatorio(1,total_pokemons));
//   traerDatos(aleatorio(1,total_pokemons));
//   traerDatos(aleatorio(1,total_pokemons));
//   traerDatos(aleatorio(1,total_pokemons));
//   traerDatos(aleatorio(1,total_pokemons));
}

function traerDatos(id){
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  .then(response => response.json())
  .then(function(data){
    let nombre = data.name;
    let url = data.sprites.other.dream_world.front_default;
    if(nombre && url)
    {
        imprimirTarjeta(nombre,url);
    }
  });
}

function imprimirTarjeta(nombre,url)
{
  let template = `<div class="tarjeta">
  <img src="${url}" alt="" >
    <br>
    <label for="">
      ${nombre}
    </label> <br>
    <button >Click to Change</button>
  </div>`;
  contenedor.innerHTML = template;
  console.log(contendor)
}