var numbers = [1,2,3,4,5,6,7,8,9];
var current = 0;
var attemp = 0;
var time = 0;
var dimension = 9;
numbers = numbers.sort(()=>Math.random()-0.5);

function drawTable(length, prop){
     const grid = document.querySelector('.grid');
     grid.innerHTML = "";
     for (let i = 0; i < length; i++) {
          let cell = document.createElement('div');
          cell.setAttribute('id', numbers[i]);
          cell.style.backgroundColor = "#1abc9c";
          cell.style.width = prop +"px";
          cell.style.height = prop +"px";
          cell.style.border = "1px solid #16a085";
          cell.style.cursor = "pointer";
          cell.style.textAlign = "center";
          cell.style.display = "table-cell";
          cell.style.verticalAlign = "middle";
          cell.addEventListener('click', selected);
          
          let label = document.createElement("h1");
          label.innerHTML = numbers[i];
          label.style.margin = "0px";
          label.style.position = "relative";
          label.style.top = "50%";
          label.style.transform = "translateY(-50%)";
     
          cell.appendChild(label);
          grid.appendChild(cell);
     }
}

function selected(){
     const id = this.getAttribute('id');
     attemp++;
     document.querySelector("#attemp").innerHTML = "Attemps: " +attemp;
     if(parseInt(id) == current+1){
          current++;
          if(current == dimension){
               document.querySelector('.alert').hidden = false;
               document.querySelector('.alert').innerHTML = "CONGRATULATIONS!!! YOU WIN IN " +attemp +" ATTEMPS AND " +time +" SECONDS";
               setTimeout(()=>{ 
                    document.querySelector('.alert').hidden = true;
                    location.reload();
               }, 5000);
          }
          flashColor(this, "#4cd137");
     }else{
          flashColor(this, "#e74c3c");
     }
}

function flashColor(element, color){
     element.style.backgroundColor = color;
     setTimeout(() => {
          element.style.backgroundColor = "#1abc9c";
     }, 100);
}

function selectItem(){
     let option = document.getElementById('mySelect').value;
     dimension = option*option;
     numbers = [];
     for (let i = 0; i < dimension; i++) {
          numbers[i] = i+1;
     }
     numbers = numbers.sort(()=>Math.random()-0.5);

     let prop = (dimension>36)?80:100;
     document.querySelector('.grid').style.width = "" +(option*prop) +"px";
     document.querySelector('.grid').style.height = "" +(option*prop) +"px";
     drawTable(dimension, prop);
     resetValues();
}

function resetValues(){
     time = 0;
     attemp = 0;
     current = 0;
     document.querySelector("#attemp").innerHTML = "Attemps: 0";
     document.querySelector('#time').innerHTML = "Time: 0s";
}

setInterval(()=>{
     document.querySelector('#time').innerHTML = "Time: " +time +"s";
     time++;
}, 1000);

drawTable(9, 100);
document.getElementById('year').innerHTML = new Date().getFullYear();