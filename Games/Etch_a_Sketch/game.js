
const container = document.querySelector('#container');

makeGrid(16);

function makeGrid(x) {
    for (let i = 0; i < x; i++) {
        let myRow = document.createElement('tr');
        myRow.id = "row" + i;
        myRow.classList.add('row');

        container.appendChild(myRow);

        let row = document.getElementById("row" + i);

        for (let j = 0; j < x; j++) {
            let myCol = document.createElement('td');
            myCol.classList.add('box');

            let cell = myCol.addEventListener('mouseover', function (e) {
                let colorid = document.querySelector('#color-id');
                e.target.style.background = colorid.value;
            });

            row.appendChild(myCol);
        }
    }
}

function clear() {
    container.textContent = "";
}

const btn = document.querySelector('#newGrid');
btn.addEventListener('click', function (e) {
    let x = prompt("Enter the number of squares to be added per side");
    if (x >= 0 & x <= 64) {
        clear();
        makeGrid(x);
    }
    else {
        alert("Please choose a number in the range 1 - 64");
    }
});


const clearAll = document.querySelector('#btn-clear');
clearAll.addEventListener('click', function () {
    const box = document.querySelectorAll('.box');
    box.forEach(element => {
        element.style.backgroundColor = "";
    });
});
