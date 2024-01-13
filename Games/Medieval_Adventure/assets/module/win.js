window.localStorage.removeItem('Character');
window.localStorage.removeItem('Name');

// Redirect replay
const boutonMettreAJour = document.querySelector("#goBtn");
boutonMettreAJour.addEventListener("click", function () {
    document.location.href='../index.html';
});