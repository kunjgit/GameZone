var Previous = -1; //Currently selected number
var Used = [-10,0,0,0,0,0,0,0,0,0]; //How many times a number is used on the board purely for the `used` class on the keys
var Capture = "click"; //Used for doing the correct input depending on device because things apparently can't just be simple
var NumberOrder, Symbols, Results; //Used for grid generation, you have the correct order of numbers, the order of the symbols, and the order of the results
const Pattern = [0,1,0,1,0,3,1,2,1,2,1,2,0,1,0,1,0,3,1,2,1,2,1,2,0,1,0,1,0,3,3,2,3,2,3,2]; //Used for grid drawing (0: number, 1: symbol, 2:blank space, 3:result) - I was initially going to do a mathematical approach like a 5x5 grid where 2n+1 is numbers except for 4 spaces and the others are symbols but this turns out to be the easiest to implement
var Counter = [0,0,0]; //Used for grid drawing, as a tile is placed the counter increments and so the correct ID is given
var Board = [0,0,0,0,0,0,0,0,0]; //Used to store the board
const Checking = [[0,1,2,0,1],[3,4,5,5,6],[6,7,8,10,11],[0,3,6,2,7],[1,4,7,3,8],[2,5,8,4,9]]; //Used as blueprints to check the board (the first 3 numbers signify the `Board` entries and using the indexes you get the values which have been inputted in order left to right, or top to bottom. The last 2 numbers are basically the same but are symbols which are fetched from `Symbols`)
const CheckingPlan = [[0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5]]; //With a given cell number you are given the row and column, this is then used for `Checking` for each value; also the row and column values gathered from here are the same as the result IDs in the coresponding row or column.
var Matches = [false, false, false, false, false, false]; //Tracks which answers have been matched. Also I used Capitalised variable names to signify global variables while local variables will have a lowercase first letter so I can spot if the variable was defined where I'm working or up here in a glance, still deciding if I like it or not - easy change if I or anyone else doesn't.

if(!!('ontouchstart' in window) || !!('msmaxtouchpoints' in window.navigator)) { //https://stackoverflow.com/a/13470899
   Capture = "touchend"; //touchscreens require this rather than click, because things can't be simple.
}

function Generate() {
   //Generate number and symbol orders
   NumberOrder = ArrayShuffle(Array.apply(null, {length: 10}).map(Number.call, Number).slice(1)); //https://stackoverflow.com/a/20066663
   Symbols = Array.apply(null, {length: 12}).map(Function.call, Math.random).map(function(x){return Math.floor(x * 3)}); //0:+, 1:-, 2:×
   Results = []; //Will contain the 6 answers going top to bottom 0-2 then left to right 3-5
   //Validate results are positive 
   /*across - run before you ...*/
   for(var i = 0; i < 3; i++) {
      //This does nested Actions to do the left or topmost action first then the right or bottom most action
      Results.push(Action(Action(NumberOrder[0 + i*3], NumberOrder[1 + i*3], Symbols[0 + i*5]), NumberOrder[2 + i*3], Symbols[1 + i*5]));
   }
   /*down - ...fall*/
   for(var i = 0; i < 3; i++) {
      Results.push(Action(Action(NumberOrder[0 + i], NumberOrder[3 + i], Symbols[2 + i]), NumberOrder[6 + i], Symbols[7 + i]));
   }
   
   //console.log(NumberOrder);
   //console.log(Symbols);
   //console.log(Results);

   //This draws out the final solution in the console (if you want to cheat), this was originally how I had the tile generation set out and I was going to delete this after I was done but I've kept it in - but everything to line 109 can be ignored
   for(var j = 0; j < 7; j++) {
      var l = "";
      for(var i = 0; i < 7; i++) {
         if(j%2 == 0 && j <5) {
               switch(i) {
                  case 0:
                     l += NumberOrder[0 + (j/2)*3];
                     break;
                  case 1:
                     l += SymbolToChar(Symbols[0 + (j/2)*5]);
                     break;
                  case 2:
                     l += NumberOrder[1 + (j/2)*3];
                     break;
                  case 3:
                     l += SymbolToChar(Symbols[1 + (j/2)*5]);
                     break;
                  case 4:
                     l += NumberOrder[2 + (j/2)*3];
                     break;
                  case 5:
                     l += "=";
                     break;
                  case 6:
                     l += Results[0+(j/2)];
                     break;
               }
         } else if (j < 5) {
            switch(i) {
                  case 0:
                     l += SymbolToChar(Symbols[2 + ((j-1)/2)*5]);
                     break;
                  case 1:
                     l += " ";
                     break;
                  case 2:
                     l += SymbolToChar(Symbols[3 + ((j-1)/2)*5]);
                     break;
                  case 3:
                     l += " ";
                     break;
                  case 4:
                     l += SymbolToChar(Symbols[4 + ((j-1)/2)*5]);
                     break;
                  case 5:
                     l += " ";
                     break;
                  case 6:
                     l += " ";
                     break;
               }
         } else if (j == 5) {
            l = "=     =     =";
            break;
         } else if (j == 6) {
            l += Results[3];
            l += Array(7 - (Results[3] + "").length).join(" ");
            l += Results[4];
            l += Array(7 - (Results[4] + "").length).join(" ");
            l += Results[5];
            break;
         }
         l += "  ";
      }
      console.log(l);
   } /**/
   
   if (
      Math.min.apply(Math, Results) < 0 || 
      Math.max.apply(Math, Results) > 50 || 
      Symbols.filter(function(x){return x == 0}).length < 2 || 
      Symbols.filter(function(x){return x == 1}).length < 2 || 
      Symbols.filter(function(x){return x == 2}).length < 2) {
      /*
      I want the minimum result to be positive, maximum to be no bigger than 50, and each symbol is used at least twice; games will be more interesting and more do-able.
      */
      console.clear();
      Generate(); //Let's do that again
   } else {
      DrawGrid(); //Let's go 🎉👇
   }
}
function DrawGrid() {
   var c = 0;
   var html = ""; //build html first and don't append html which isn't valid, otherwise browsers will auto-correct your code and weirdness happens
   for(var j = 0; j < 6; j++) { //columns
      html += `<div class="row">`;
      for(var i = 0; i < 6; i++) { //rows
         switch (Pattern[c]) { //using the Pattern we can print a cell one by one just incrementing the number once
            case 0:
              html += '<div class="number" cell="'+Counter[0]+'"></div>';
              Counter[0]++;
              break;
            case 1:
              html += '<div class="symbol">'+SymbolToChar(Symbols[Counter[1]])+'</div>';
              Counter[1]++;
              break;
            case 2:
              html += '<div class="gap"></div>'; 
              break;
            case 3:
              html += '<div class="result" result="'+Counter[2]+'">'+Results[Counter[2]]+'</div>';
              Counter[2]++; //I could have just switched result and gap with each other then just increment on [c] if c < 3 but this is actually a worse idea if you want the full power and lightning fast generation time for a puzzle that takes a few minutes to solve and actually people don't notice the difference between a milisecond or not when it is added onto the already slightly random length of time it takes for the page to load.
              break;
         }
         c++; //One increment coming up
      }
      html += `</div>`;
   }
   $("#board").html(html); //All html together
}
function CheckEntry(cell) { //Check to see if the row and column containing the cell is valid or not
   for(var p = 0; p < 2; p++) {
      var c = Checking[CheckingPlan[cell][p]]; //Inputting the cell ID then p (0: horizontal, 1: vertical) we can then get a template for the data, the first 3 numbers are the inputted values and the last 2 are the symbols
      c=c.map(function (x,i) {
         return i < 3 ? Board[x] : Symbols[x]; //Convert the template to data
      });
      if(c.slice(0,3).filter(function(x){return x == 0}).length > 0) { //If there is a gap
         $(`.result[result=${CheckingPlan[cell][p]}]`).removeClass("correct").removeClass("wrong");
         Matches[CheckingPlan[cell][p]] = false; //If the row is not filled it is not complete
      }
      else if(Action(Action(c[0],c[1],c[3]), c[2],c[4]) == Results[CheckingPlan[cell][p]]){ //If they match the result, result ID goes from 0-2 as horizontal increments, then 3-5 as vertical increments
         $(`.result[result=${CheckingPlan[cell][p]}]`).addClass("correct").removeClass("wrong");
         Matches[CheckingPlan[cell][p]] = true; //If the row is complete it is complete
      }
      else { //if it doesn't
         $(`.result[result=${CheckingPlan[cell][p]}]`).removeClass("correct").addClass("wrong");
         Matches[CheckingPlan[cell][p]] = false; //Or maybe you could re-write the rules of mathematics?
      }
      //console.log(c);
   }
   //console.log(Matches.filter(function(x) {return x}));
   console.log(Used.filter(function(x) {return x == 1}).length);
   if(Matches.filter(function(x) {return x}).length == 6 && Used.filter(function(x) {return x == 1}).length == 9) { //filters and mapping are incredible and are a powerful tool and open you up to being confused why things are failing because I keep forgetting to add the return because I'm too familiar with linq `x => x` (or as my brain interprets it `function(x){x})` so I sometimes autopilot just `x`) rather than `return x`
      $("#winner").addClass("show"); //🎉 they deserved it, or they cheated and get a slap on the wrists - I was going to check for people opening the console then geo-locate them and turn up at their doors to slap their wrists but there's probably legal issues and effort.
   }
}

function SymbolToChar(s) {
   switch (s) {
      case 0:
         return "+";
      case 1:
         return "-";
      case 2:
         return "×"; //Fun fact: Alt+158, one of the very few codes I remember
   }
}

function Action(a, b, f) { //Related but kinda completely unrelated: https://en.wikipedia.org/wiki/Reverse_Polish_notation
   switch(f) {
      case 0:
         return a+b;
      case 1:
         return a-b;
      case 2:
         return a*b;
      //You can add more but it just gets annoying to solve
   }
}
function ArrayShuffle(a) { //https://stackoverflow.com/a/6274381
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

$(document).on(Capture, ".number", function() {
   if (Previous >= 0) { //if a key is selected, if none are selected `Previous` is `-1`
      if ($(this).attr("value") != Previous) {
         Used[$(this).attr("value")]--; //Decrement the number that was there (might enable the button)
         Used[Previous]++; //Increment the new number (might disable the button, well - it will disable it)
         Board[$(this).attr("cell")] = parseInt(Previous); //Set the value of the tile to the array
         if(Used[$(this).attr("value")] <= 0) { //Enable the button if the value is 0
            $(`.key[key=${$(this).attr("value")}]`).removeClass("used");
         }
         if(Used[Previous] > 0 && Previous != 0) { //Disable the button if the new value is more than 0 and if the key id is not 0 (delete), which it should always but yeah
            $(`.key[key=${Previous}]`).addClass("used");
         }
      }
      $(this).attr("value", Previous); //Set the value attribute, although I will (Edit: I'm re-reading this and I don't understand it but it might make sense?)
      $(this).html(Previous <= 0 ? "" : Previous); //inline statements make things look cool, because they are
      CheckEntry($(this).attr("cell")); //Check to see if a line has been solved, if there is an error, or more numbers are needed
   }
});
$(document).on(Capture, "#keyboard .key", function(){
   $("#keyboard .key").removeClass("selected");
   if($(this).attr("key") != Previous) {  //If you have not clicked the same number in the on-screen keyboard twice in a row
      $(this).addClass("selected");
      Previous = $(this).attr("key");
   } else { //If you have clicked the same number twice in a row
      Previous = -1;
   }
   $("#game").attr("cursor", Previous);
})
$(document).on(Capture, "#close", function() {
   $("#winner").removeClass("show");
});
$(document).on(Capture, "#new", function() {
   window.location.reload(false); 
});

Generate();