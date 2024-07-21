// script.js
const gameBoard = document.getElementById('gameBoard');
const moneyElement = document.getElementById('money');
const happinessElement = document.getElementById('happiness');
const pollutionElement = document.getElementById('pollution');
const debtElement= document.getElementById('debtornot');

//defined a object to store the cost ,happines impact and the color of each building
const buildings = {
    house: { cost: 100, happiness: 10, color: '#118382' },
    factory: { cost: 200, happiness: -20, color: 'black' },
    park: { cost: 120, happiness: 20, color: 'rgb(87,203,59)' }
};

let currentBuilding = null;
let money = 1000;
let happiness = 100;
let pollution = 0;
let modified =0;//this is to track how many building have been created
let factoryadded=0;//this is to track how many factories are there
let houseadded=0;//this is to track how many houses are there
let parkadded=0;//this is to track how many parks are there


//both of these are used in calculating the final result 
let currentpollution=0; // to calculate if pollution is increasing or decreasing with time
let currentmoney=0;     // to calculate if money is increasing or decreasing over time


// Create the game board
for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.addEventListener('click', () => placeBuilding(cell));
    gameBoard.appendChild(cell);
}

// Update money, happiness and pollution display
function updateInfo() {
    moneyElement.textContent = money;
    happinessElement.textContent = happiness;
    pollutionElement.textContent= pollution;
    if(money<0)
        debtElement.innerText="(your city is in debt)";
    else
        debtElement.innerText="";
}

// Place a building on the selected cell
function placeBuilding(cell) {
    if (currentBuilding && cell.style.backgroundColor === '') {
        const building = buildings[currentBuilding];
        if (money >= building.cost) {
            cell.style.backgroundColor = building.color;
            if(currentBuilding==="house")
                {
                   houseadded++;
                   
                    setInterval(() => {
                        money -= 20; //maintaining cost of house every minute
                        pollution+=1;//pollution created by house
                        updateInfo();
                    }, 20000);
                }    
            else if(currentBuilding==="factory")
                {
                   factoryadded++;
                    setInterval(() => {
                        money+=50;//factory generates money every minute
                        pollution+=15;//pollution created by factory
                        updateInfo();
                    }, 20000);
                }
            else if(currentBuilding==='park')
                {
                    parkadded++;
                    setInterval(() => {
                        money-=10; //maintaining cost of the park 
                        pollution-=13;//decrease pollution over time
                        updateInfo();
                    }, 20000);
                }
            money -= building.cost;    
            happiness += building.happiness;
            modified++;//increase the modified so that we can know at any time , how many buildings have been added
            updateInfo();
        } else {
            alert('Not enough money to place this building!');
        }
    }
}

// Button event listeners
document.getElementById('placeHouse').addEventListener('click', () => {
    currentBuilding = 'house';
});
document.getElementById('placeFactory').addEventListener('click', () => {
    currentBuilding = 'factory';
});
document.getElementById('placePark').addEventListener('click', () => {
    currentBuilding = 'park';
});

updateInfo();


//we need the interval id to stop the interval after the game is finished
let interval1=setInterval(() => {
    
    //below if is necessary to not to run unnecessary code as if modified < 100 means city is not build completely
    if(modified<100){
        return;
    }
   
    else
    {
        currentmoney=money; //set present money to use after 80sec , if it increase or decrease
        currentpollution=pollution;//set present pollution to compare with with future pollution
        setTimeout(() => {
            calfinalresult();  
        }, 80000);
        clearInterval(interval1);//clearing the interval of checking whether whole city is built or not
    }
        

}, 60000);

// to know the final result of the game 
function calfinalresult(){

    document.getElementById('instruct').style.display='none';//hiding instructions div
    document.getElementById('gameContainer').style.display='none';//hiding game's div
    document.getElementById('final-result').style.display='block';//displaying final resutl div

    //updating the content for final result
    document.getElementById('factory-result').innerText=`You created a total of ${factoryadded} Factories`;
    document.getElementById('house-result').innerText=`You created a total of ${houseadded} Houses`;
    document.getElementById('park-result').innerText=`You created a total of ${parkadded} Parks`;


    //determining the result and disply it .
    if(happiness<100 ||money<0 || money<currentmoney || pollution>currentpollution)
        {
            
            document.getElementById('money-result').innerText="Your city's money is continuously decreasing";
            document.getElementById('pollution-result').innerText="Your city's pollution is continuously increasing";
            document.getElementById('happiness-result').innerText="Your city's happiness is too low";
            
            return;
        }    
    else {
        document.getElementById('money-result').innerText="Your city's money is continuously increasing";
        document.getElementById('pollution-result').innerText="Your city's pollution is continuously decreasing";
        document.getElementById('happiness-result').innerText="Your city's happiness is at good level";
        
        return;
    }
}
