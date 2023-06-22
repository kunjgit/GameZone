//initial variables
const PokemonName= document.querySelector('.pokemon_name');
const PokemonNumber= document.querySelector('.pokemon_number');
const PokemonImage= document.querySelector('.pokemon_image');
const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon=1;
//bring the data from the pokeApi
const fetchPokemon = async (pokemon) => {
    const APIresponse =  await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (APIresponse.status ===200){
    const data= await APIresponse.json();
    return data;}
}

const renderPokemon = async (pokemon)=>{
//waiting for the response of the api
    PokemonName.innerHTML = 'carregando...';
    PokemonNumber.innerHTML = '';

    const data = await fetchPokemon(pokemon);
//select the info that we want from the api
    if(data){
    PokemonName.innerHTML = data.name;
    PokemonNumber.innerHTML = data.id;
    PokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    input.value='';
    } else{
        // PokemonImage.style.display='none';
        PokemonName.innerHTML = 'não encontrado :c';
        PokemonNumber='';
    }
}
//search the name of the pokemon from the search bar
form.addEventListener('submit',(event) =>{
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});
//button previous pokemon
buttonPrev.addEventListener('click',(event) =>{
   alert('prev clicked')
});
//button next pokemon
buttonNext.addEventListener('click',(event) =>{
    alert('next clicked')
 });

renderPokemon(searchPokemon);


