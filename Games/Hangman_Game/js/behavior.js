
//JUEGO VARIABLES
const listaPalabras = ['PERRO', 'GATO', 'MOSCA', 'CABALLO'];
let palabra_censura = [];
let palabraAdivinar = [];
let letrasUsadas = [];
let respuesta = ``;
let max_intentos = 6;
let intentos = 0; //depende la imagen del valor de esta variable
let ref_letra = document.querySelector('#letra');
let ref_intentos = document.querySelector('#intentos');
let ref_resultado = document.querySelector('#resultado');
let ref_palabraCorrecta = document.querySelector("#correct_word");
var startDiv = document.getElementById("start-game");
var gameCanvas = document.getElementById("game-section");
let title_gameOver = document.getElementById("title-gameOver");
//MODAL REFERENCIAS
var modal = document.getElementById("modal-config"); //obtenemos el modal
var btn = document.getElementById("btn-modal"); //obtenemos el boton
var span = document.getElementsByClassName("close")[0]; //obtenemos el boton para cerrar el modal
var modal_gameOver = document.getElementById("modal-gameOver");
var modal_winner = document.getElementById("modal-winner");

//FORMULARIO PALABRAS
let form = document.getElementById("form");
let input = document.getElementById("nueva_palabra");
let mensajeError = document.getElementById("mensaje");
let mensajeSucces = document.getElementById("mensajeGuardado");
let mensajeAdvertencia = document.getElementById("mensajeAdvertencia");
let contenedorPalabras = document.getElementById("lista-palabras-disp");
//MODAL 

//JUEGO FUNCIONES
function iniciarJuego(){
    let indiceAleatorio = Math.floor(Math.random() * listaPalabras.length); 
    let palabraAleatoria = listaPalabras[indiceAleatorio];
    respuesta = palabraAleatoria;
    palabraAdivinar = palabraAleatoria.split('');
    
    for(let letra of palabraAdivinar){
        palabra_censura.push('_');
    }
    remplazarTexto();
}

function remplazarTexto(){
    ref_resultado.textContent = palabra_censura.join(' ');
    ref_intentos.textContent = `Intentos restantes: ${max_intentos}`;
}

function inputUsuario(inputLetra, id){
    let letraUsuario = inputLetra;
    let idBtn = id;
    //encontramos la letra proporcionada por el usuario
    for(const[posicionLetra, letraAdivinar] of palabraAdivinar.entries()){
        if(letraUsuario == letraAdivinar){

            palabra_censura[posicionLetra] = letraAdivinar;

            document.getElementById(`${idBtn}`).disabled = true;
            letrasUsadas.push(idBtn);
        }
    }

    gameStatus(idBtn, letraUsuario);
    remplazarTexto();
}

  
function gameStatus(param_id, param_usr_letra){
    //GAME OVER
    if(!palabraAdivinar.includes(param_usr_letra)){
        intentos +=1;
        max_intentos -= 1;
        letraIncorrecta();
        
        document.getElementById(`${param_id}`).disabled = true;
        letrasUsadas.push(param_id);
        if(max_intentos == 0){
            console.log(respuesta);
            gameOver();
        }
    }

    //WINN
    if(!palabra_censura.includes('_')){
        winner();
    }
}


//Animacion letra Incorrecta
function letraIncorrecta(){
    //Eliminamos la clase con la animacion y la agregamos nuevamente
    //eso da el efecto de reiniciar cada que la palabra falle
    ref_intentos.classList.remove("intentoFallido");
    void ref_intentos.offsetWidth;
    ref_intentos.classList.add("intentoFallido");
    document.getElementById("imagen_ahorcado").src = "assets/ahorcado_assets/intento_"+intentos+".png"; //Obtenemos el path y lo modificamos
}

//Animacion mensaje error
function anim_msg_error(){
    mensajeError.classList.remove("msg_error");
    void mensajeError.offsetWidth;
    mensajeError.classList.add("msg_error");
}
//Animacion mensaje guardado
function anim_msg_guardado(){
    mensajeSucces.classList.remove("msg_guardado");
    void mensajeSucces.offsetWidth;
    mensajeSucces.classList.add("msg_guardado");
}
//Animacion mensaje advertencia
function anim_msg_advertencia(){
    mensajeAdvertencia.classList.remove("msg_advertencia");
    void mensajeAdvertencia.offsetWidth;
    mensajeAdvertencia.classList.add("msg_advertencia");
}

function gameOver(){
    title_gameOver.innerHTML = `¡Has perdido!`;
    modal_gameOver.style.display = "block";
    ref_palabraCorrecta.textContent = `${respuesta}`;
}

function winner(){
    modal_winner.style.display = "block";
}

function rendirse(){
    gameOver();
    title_gameOver.innerHTML = `¡Te has rendido!`;
}

//MAIN MENU PLAY
function Play(){
    startDiv.style.display = "none";
    gameCanvas.style.display = "block";
    document.getElementById("imagen_ahorcado").src = "assets/ahorcado_assets/intento_0.png"; //Obtenemos el path y lo modificamos
    iniciarJuego();
    reiniciar();
}


function reiniciar(){
    max_intentos = 6;
    intentos = 0;
    palabra_censura = [];
    document.getElementById("imagen_ahorcado").src = "assets/ahorcado_assets/intento_"+intentos+".png"; //Obtenemos el path y lo modificamos
    ref_intentos.classList.remove("intentoFallido"); 
    //Comprobamos si hay id almacenado, de ser asi, las reactivamos
    if(letrasUsadas.length != 0){
        for(let i = 0; i <= letrasUsadas.length - 1; i++){
            document.getElementById(`${letrasUsadas[i]}`).disabled = false;
        }
    }

    let nuevo_indiceAleatorio = Math.floor(Math.random() * listaPalabras.length); 
    let nuevo_palabraAleatoria = listaPalabras[nuevo_indiceAleatorio];
    respuesta = nuevo_palabraAleatoria;
    palabraAdivinar = nuevo_palabraAleatoria.split('');
    
    for(let letra of palabraAdivinar){
        palabra_censura.push('_');
    }
    remplazarTexto();
}

function btn_home(){
    gameCanvas.style.display = "none";
    modal_gameOver.style.display ="none"
    modal_winner.style.display = "none";
    startDiv.style.display = "block";

}

function btn_reiniciar(){
    reiniciar();
    modal_gameOver.style.display = "none";
    modal_winner.style.display = "none";
}

//MODAL CONFIG
//al hacer click en el boton, el modal se abre
btn.onclick = function(){
    modal.style.display = "block";
}

//Al hacer click en el span, el modal se cierra
window.onclick = function(event){
    if(event.target == span){
        mensajeError.style.display = "none";
        mensajeAdvertencia.style.display = "none";
        mensajeSucces.style.display = "none";
        modal.style.display = "none";
    }
}



//VALIDAMOS LA PALABRA
function formValidation(word){
    event.preventDefault();
    word = input.value;
    word = word.toUpperCase();

    if (word === ""){
        mensajeAdvertencia.style.display = "none"
        mensajeSucces.style.display = "none";
        mensajeError.style.display = "block";
        anim_msg_error();
        mensajeError.innerHTML = "ingrese una palabra";
 
    } else {

        if (listaPalabras.includes(word)){
            mensajeError.style.display = "none";
            mensajeSucces.style.display = "none";
            mensajeAdvertencia.style.display = "block"
            anim_msg_advertencia();
            mensajeAdvertencia.innerHTML = "la palabra ya esta registrada"
        } else {
            console.log("correcto");
            mensajeAdvertencia.style.display = "none";
            mensajeError.style.display = "none";
            mensajeSucces.style.display = "block";
            anim_msg_guardado();
            mensajeSucces.innerHTML = "¡Guardado con exito!";
            registrarPalabra();
        }
    }
}

//AGREGAMOS LA PALABRA AL ARREGLO
function registrarPalabra(){
    let dato = input.value;
    listaPalabras.push(dato.toUpperCase());
    contenedorPalabras.innerHTML += `<li class="list-item">${dato}<li>`;
    input.value = "";
    console.log(listaPalabras);
}

//Evento para la validación del input, detecta si se ingresan números
document.getElementById("nueva_palabra").addEventListener("input", (e) => {
    let value = e.target.value;
    
    e.target.value = value.replace(/[0-9]/g, "");

    if(value.match(/[0-9]/g)){
        mensajeSucces.style.display = "none";
        mensajeError.style.display = "none";
        mensajeAdvertencia.style.display = "block"
        anim_msg_advertencia();
        mensajeAdvertencia.innerHTML = "No se permiten numeros"
    } else {
        mensajeAdvertencia.style.display = "none"
    }
  });