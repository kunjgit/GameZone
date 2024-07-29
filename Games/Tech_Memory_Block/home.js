//arr[] contains the list of images
var arr=[];

//Stores the opened elements
var open_ele=[];

//Total number of matches found
var total=0;

//Attempts for each difficulty level
var max_beginner = 30;
var max_intermediate = 27;
var max_expert = 25;

//Attempts for User selected difficulty level
var attempts = max_beginner;

//Stores the difficulty level that the user is currently playing. Initially initialized to empty
var mode="";

//Set to 1 if user fails a level else 0
var fail=0;

//Multiple blocks opened will be closed in the order of its opening
function changeImage(a)
{
  
  //check if only one element is open
  //if yes wait keep the element open expecting user to open another element
  if(open_ele.length == 0)
  {
    a.style.backgroundColor="Transparent";
    a.style.backgroundImage="url('"+arr[Number(a.getAttribute("id"))]+"')";
    open_ele.push(a);
    return;
  }
  
  //if the present length of array is one add one more element and start checking for matching
  if(open_ele.length == 1)
  {
       a.style.backgroundColor="Transparent";
       a.style.backgroundImage="url('"+arr[Number(a.getAttribute("id"))]+"')";
       open_ele.push(a);
       
       //if bg images of both images are the same
       if(open_ele[0].style.backgroundImage.split("/")[2] == open_ele[1].style.backgroundImage.split("/")[2])
       {
          window.setTimeout(function(){
          open_ele[0].style.backgroundColor="rgb(188, 194, 190)";
          open_ele[1].style.backgroundColor="rgb(188, 194, 190)";
          open_ele[0].style.visibility="hidden";
          open_ele[1].style.visibility="hidden";
          //Empty the array
          open_ele.length=0;

          },2000);
          //Incrementing the total number of matches found out of 8
          //Decides the end of game
          total++;
          var len = document.getElementsByClassName("score")[0].getElementsByTagName("li").length;
          document.getElementsByClassName("score")[0].getElementsByTagName("li")[len-1].innerHTML="Blocks unlocked : " + String(total) + " / 18"; 

          if(total == 18) //if all matches are found
          {
            showModal();
             eles = document.getElementsByClassName("score")[0].getElementsByTagName("li");
             eles[eles.length-2].innerHTML="Player 1 : " + mode +" <span style='color : rgb(45,247,55);'>Completed</span>";
             document.getElementsByTagName("table")[0].style.display="none";
             document.getElementsByClassName("message")[0].style.display="block";
             document.getElementsByClassName("message")[0].innerHTML=":) Congrats. You unlocked all blocks!.";
             document.getElementsByClassName("message-button")[0].style.display="block";
             return;
          }
        }
        else
        {
           attempts--; //reduce the attempts 
          
           //updating the attempts left in menu bar
          document.getElementsByTagName("attempt")[0].innerHTML = "Attempts : " + attempts;
          
          if(attempts == 0)
          {
            showModal();
            fail=1;
            eles = document.getElementsByClassName("score")[0].getElementsByTagName("li");
            eles[eles.length-2].innerHTML="Player 1 : " + mode +" <span style='color : rgb(252,3,11);'>Failed</span>";
            document.getElementsByTagName("table")[0].style.display="none";
            document.getElementsByClassName("message")[0].style.display="block";
            document.getElementsByClassName("message")[0].innerHTML=":( Oops.....You ran out of attempts.";
            document.getElementsByClassName("message-button")[0].style.display="block";
            open_ele.length=0;
             return;
          }

           

           //Give a 2 second delay for the user to see the picture and hide them
           window.setTimeout(function(){
           open_ele[0].style.backgroundColor="black";
           open_ele[1].style.backgroundColor="black";
           open_ele[0].style.backgroundImage="none";
           open_ele[1].style.backgroundImage="none";
           open_ele.length=0;
           },2000);
        }
  }
 
}

//This hides the intro screen
function hideIntro()
{
    window.setTimeout(function(){
    document.getElementsByClassName("intro")[0].style.display="none";
    selectDifficulty();
    setBackground();
   },5000);
}

//Function for shuffling the array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

//Sets the background image for each block which the user will open
//The array is shuffles using shuffle() and assigned to each block in order of the blocks
function setBackground()
{
  console.log("setb");
  arr.length=0;
  for(var i=1;i<=18;i++)
  {
    arr.push("Images/org/"+String(i)+".jpg");
    arr.push("Images/copy/"+String(i)+".jpg");
  }
   arr = shuffle(arr);  

    //Set the attempts left on the menu bar as well
  document.getElementsByTagName("attempt")[0].innerHTML = "Attempts : " + 0;

  //Hide the message and button elements
  document.getElementsByClassName("message")[0].style.display="none";
  document.getElementsByClassName("message-button")[0].style.display="none";

  //Show the table as before
  document.getElementsByTagName("table")[0].style.display="inline-block";

  //During the game we changed the visibility of td elements to hidden and removed its background color and set a bg image as well
  //Revert all those actions and prepare the table for a fresh game
  td = document.getElementsByClassName("ele");
  for(var i=0;i<td.length;i++)
  {
    td[i].style.backgroundColor="black";
    td[i].style.backgroundImage="none";
    td[i].style.visibility="visible";
  }
}

function selectDifficulty()
{
  document.getElementsByClassName("difficulty")[0].style.display="block";
}

function setDifficulty(_mode)
{
  //_mode denotes max attempts
  //0 denotes easy 
  //1 denotes intermediate
  //2 denotes expert
  switch(_mode)
  {
    case 0:
      attempts = max_beginner;
      mode = "Easy Level";
      break;

    case 1:
      attempts = max_intermediate;
      mode = "Intermediate Level";
      break;
    
    case 2:
      attempts = max_expert;
      mode = "Hard Level";
      break;
  }
  ul = document.getElementsByClassName("score")[0];
  li_1 = document.createElement("li");
  li_2 = document.createElement("li");
 
  li_1.innerHTML="Player 1 : "+ mode +" <span style='color : rgb(227,72,20);'>ongoing</span>";
  li_2.innerHTML="Blocks unlocked : " + String(total) + " / 18"; 
  
  ul.appendChild(document.createElement("br"));
  ul.appendChild(document.createElement("br"));
  ul.appendChild(li_1);
  ul.appendChild(document.createElement("br"));
  ul.appendChild(li_2);
  ul.appendChild(document.createElement("br"));
  ul.appendChild(document.createElement("br"));
  document.getElementsByTagName("attempt")[0].innerHTML = "Attempts : " + attempts;
  document.getElementsByClassName("difficulty")[0].style.display="none"; //close modal and start the game
 }

 //Restarts the game by reshuffling the array again. Done by calling the defined functions again.
function restartGame()
{
  fail=0;
  document.getElementsByClassName("modal")[1].style.display="none";
  lis = document.getElementsByClassName("score")[0];
  lis.remove();

  //create UL element, set class attribute to score and append it to leader element
  ul = document.createElement("ul");
  ul.setAttribute("class","score");
  document.getElementsByClassName("leader")[0].appendChild(ul);
  total=0;
  selectDifficulty();
  setBackground();
}

function playAgain()
{
  total=0;
  len = document.getElementsByClassName("score")[0].getElementsByTagName("li").length;
  if(fail == 1)
  {
    if(mode == "Easy Level")
    {
      attempts=max_beginner;
      total=0;
      document.getElementsByClassName("score")[0].getElementsByTagName("li")[len-1].innerHTML="Blocks unlocked : " + String(total) + " / 18";
    }

    if(mode == "Intermediate Level")
    {
      attempts=max_intermediate;
      total=0;
      document.getElementsByClassName("score")[0].getElementsByTagName("li")[len-1].innerHTML="Blocks unlocked : " + String(total) + " / 18";
    }

    if(mode == "Hard Level")
    {
      attempts=max_expert;
      total=0;
      document.getElementsByClassName("score")[0].getElementsByTagName("li")[len-1].innerHTML="Blocks unlocked : " + String(total) + " / 18";
    }
    document.getElementsByTagName("attempt")[0].innerHTML = "Attempts : " + attempts;
    setBackground();
  }
  else
  {
  selectDifficulty();
   setBackground();
  }
}

function hideModal(a)
{
  document.getElementsByClassName("modal")[a].style.display="none";
}

function showModal()
{
  document.getElementsByClassName("modal")[0].style.display="block";
}

window.onresize = function()
{
  console.log(window.innerWidth);
}