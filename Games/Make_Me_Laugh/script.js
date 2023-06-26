const fetch_display_joke=()=>{
    $.getJSON('https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Spooky?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single', function(data) {
        $(".joke").html(data.joke).text()
});
}
fetch_display_joke()
let funny=new Audio("./assets/audio/funny.wav")
let not_funny=new Audio("./assets/audio/not_funny.wav")

let click_funny=()=>{
    not_funny.pause()
    funny.play()
}

let click_not_funny=()=>{
    funny.pause()
    not_funny.play()
}
