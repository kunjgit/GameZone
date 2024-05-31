let largura = 0
let altura = 0
let vidas = 1
let tempo = 30

let criaMosquitoTempo = 2000

//Configuração dos niveis.
let nivel = window.location.search
nivel = nivel.replace('?', '')

if (nivel === 'normal') {

    //Nível: Condomínio
    criaMosquitoTempo = 2000

} else if (nivel === 'dificil') {

    //Nível: Interior
    criaMosquitoTempo = 1500

} else if (nivel === 'extremo') {

    //Nível: Matagal
    criaMosquitoTempo = 1000

} else if (nivel === 'insano') {

    //Nível: Mata Atlântica
    criaMosquitoTempo = 750

}

function ajustaTamanhoPalcoJogo() {
    altura = window.innerHeight
    largura = window.innerWidth

    console.log(largura, altura)
}

ajustaTamanhoPalcoJogo()

let cronometro = setInterval(function() {

    tempo -= 1

    if (tempo < 0) {
        clearInterval(cronometro)
        clearInterval(criaMosquito)
        window.location.href = 'vitoria.html'
    } else {
        document.getElementById('cronometro').innerHTML = tempo
    }

}, 1000)

function posicaoRandomica() {

    //Remover mosquito anterior (caso exista).
    if (document.getElementById('mosquito')) {
        document.getElementById('mosquito').remove()

        //console.log('elemento selecionado foi: v' + vidas)
        if (vidas > 3) {

            window.location.href = 'fim_de_jogo.html'
        } else {
            document.getElementById('v' + vidas).src = "img/coracao_vazio.png"

            vidas++

        }
    }


    let posicaoX = Math.floor(Math.random() * largura) - 90
    let posicaoY = Math.floor(Math.random() * altura) - 90

    //Corrigindo problema se caso a posição do mosquito fique 0px na subtração por 90px e suma da tela.
    posicaoX = posicaoX < 0 ? 0 : posicaoX
    posicaoY = posicaoY < 0 ? 0 : posicaoY

    console.log(posicaoX, posicaoY)

    //Criando o elemento "mosquito" no HTML
    let mosquito = document.createElement('img')
    mosquito.src = 'img/mosca.png'
    mosquito.className = tamanhoAleatorio() + ' ' + ladoAleatorio() //Espaço em branco na concatenação para não haver problema na chamada.
    mosquito.style.left = posicaoX + 'px'
    mosquito.style.top = posicaoY + 'px'
    mosquito.style.position = 'absolute'
    mosquito.id = 'mosquito'
    mosquito.onclick = function() {
        this.remove()
    }

    document.body.appendChild(mosquito)

}

//Função para a criação aleatoria de tamanho dos mosquitos na tela.
function tamanhoAleatorio() {
    let classe = Math.floor(Math.random() * 3)

    switch (classe) {
        case 0:
            return 'mosquito1'

        case 1:
            return 'mosquito2'

        case 2:
            return 'mosquito3'
    }
}

function ladoAleatorio() {
    let classe = Math.floor(Math.random() * 3)

    switch (classe) {
        case 0:
            return 'ladoA'

        case 1:
            return 'ladoB'

    }
}