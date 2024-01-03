window.localStorage.removeItem('Character');
window.localStorage.removeItem('Name');

const boutonMettreAJour = document.querySelector("#goBtn");
boutonMettreAJour.addEventListener("click", function () {
    document.location.href='../index.html';
});