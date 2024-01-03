var wizard = document.getElementById('type1');

// Select wizard
wizard.addEventListener('click', function () {
    document.getElementById("type1").style.backgroundColor = "rgb(158, 142, 110)";
    document.getElementById("type2").style.backgroundColor = "rgb(0, 0, 0, 0)";
    window.localStorage.setItem('Character', 'wizard');
});

var warrior = document.getElementById('type2');

// Select warrior
warrior.addEventListener('click', function () {
    document.getElementById("type2").style.backgroundColor = "rgb(158, 142, 110)";
    document.getElementById("type1").style.backgroundColor = "rgb(0, 0, 0, 0)";
    window.localStorage.setItem('Character', 'warrior');
});

// Add listener to update localStorage data
const boutonMettreAJour = document.querySelector("#goBtn");
boutonMettreAJour.addEventListener("click", function () {
    window.localStorage.setItem('Name', document.getElementById("persoName").value);
    document.location.href='assets/game.html';
});
