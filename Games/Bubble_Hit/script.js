let timer = 60;
let score = 0;
let random_num_hit = 0;

function increase_score()
{
   score += 10;
   document.querySelector("#scorevalue").textContent = score;
}

function make_bubble()
{
   let bubble_counter = " ";

 for ( let i = 1; i<=102; i++)
{
   let random_num = Math.floor(Math.random()*10);
   bubble_counter += `<div class="bubble"> ${random_num} </div>`; 
}

document.querySelector("#pbtm").innerHTML = bubble_counter;
}

function new_hit(){
    random_num_hit = Math.floor(Math.random()*10);
   document.querySelector("#hitvalue").textContent = random_num_hit;
}

function run_timer()
{
   let timerint = setInterval(function (){
      if(timer>0)
      {
         timer--;
         document.querySelector("#timervalue").textContent = timer;
      }

      else
      {
         clearInterval(timerint);
         document.querySelector("#pbtm").innerHTML = `<h1> <i>Game Over</i><h1>`;
      }
   }, 1000);
}

document.querySelector("#pbtm").addEventListener("click",function(bubble){
   let clickedNumber = Number(bubble.target.textContent);

   if (clickedNumber === random_num_hit)
   {
      increase_score();
      make_bubble();
      new_hit();
   }
})

run_timer();
make_bubble();
new_hit();