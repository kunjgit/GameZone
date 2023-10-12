var openedCards=[];
var sound=1,music=0;

var imgNumbers=["1.png","2.png","3.jpg","4.png","5.jpg","6.jpg","7.jpg","8.png","9.png","10.png","11.png","12.png","13.png","14.png","15.png","16.jpg","17.png","18.jpg"];

var selectedImgs=[];
for(var i=1,k=1;i<=8;i++,k+=2)
{
    var index=Math.floor(Math.random()*imgNumbers.length);

    $("#cell"+k+" .back_view img").attr("src","./images/icon"+imgNumbers[index]);
   
    selectedImgs.push(imgNumbers.splice(index,1));
}
for(var i=1,k=2;i<=8;i++,k+=2)
{
    var index=Math.floor(Math.random()*selectedImgs.length);
    $("#cell"+k+" .back_view img").attr("src","./images/icon"+selectedImgs[index]);
    // alert(selectedImgs[index]+extensions[k]);
    selectedImgs.splice(index,1);
}

var aud=new Audio("./sounds/BGM.mp3");
aud.play();
$(aud).prop("volume",0.3);
// aud.autoplay;

$(".sounds li").click(function()
{
    $("#"+$(this).attr("id")).toggleClass("clicked");
    if($(this).attr("id")=="music")
    {
        music=1-music;
        if(music) aud.play();
        else aud.pause();
    }
    else
    {
        sound=1-sound;
        // alert(sound+"=sound");
    }
    
});

// $(".score_menu #score").text("Your Score : "+score);
// $(".score_menu #maxScore").text("High Score : "+maxScore);
//For switching between Game and home screens
$("#play").click(function()
{
    $(".game_screen").slideDown(1);
    $(".game_screen").css("display","flex");
    $(".home_screen").css("display","none");
    
});
var difficulty=["Easy","Medium","Hard"];
var i=0;

$("#left").css("visibility","hidden");

$("#level i").click(function(){
    var clickedIcon = $(this).attr("id");
    if(clickedIcon=="left")
    {
        i=( i===0 ? 2 : i-1 );
    }
    else
    {
        i=( i===2 ? 0 : i+1 );
    }

    if(i===0)
    {
        $("#left").css("visibility","hidden");
    }
    else
    {
        $("#left").css("visibility","visible");
    }
    if(i===2)
    {
        $("#right").css("visibility","hidden");
    }
    else
    {
        $("#right").css("visibility","visible");
    }

    $("#level p").text(difficulty[i]);
    if(sound==1)
    {
        var aud=new Audio("./sounds/click.wav");
        aud.playbackRate=2.5;
        aud.play();
    }
});

var currNoOfPairs=(i+2)*(i+2)*2;

// $(".exit_menu h2").click(function()
// {
//     $(".home_screen").slideUp(1000);
//     $(".home_screen").css("display","flex");
//     $(".game_screen").css("display","none");

//     if(sound==1)
//     {
//         var aud=new Audio("./sounds/click.wav");
//         aud.playbackRate=2.5;
//         aud.play();
//     }
    
    
// });

$("li:not(#level)").click(function()
{
    if(sound==1)
    {
        var aud=new Audio("./sounds/click.wav");
        aud.playbackRate=2.5;
        aud.play();
    }
  
});

// For flipping the cards
$(".front_view").addClass("visible");

$(".grid_cell .front_view").click(function()
{
    if(openedCards.length<2)
    {
        var cellId = $(this).parent().attr("id");

        if(sound==1)
        {
            var aud=new Audio("./sounds/open_card.mp3");
            aud.playbackRate=2.5;
            aud.play();
        }
        



        $("#"+cellId).css("transform","perspective(600px) rotateY(180deg)").css("transition"," transform 0.5s ease-out");


        setTimeout(function(){
            $("#"+cellId +" .front_view").toggleClass("visible");
            $("#"+cellId +" .back_view").toggleClass("visible");
        },150);

        openedCards.push(cellId);
        checkCards();
    }
});
// $(".grid_cell .back_view").click(function()
// {
//     // var cellId = $(this).parent().attr("id");

//     // $("#"+cellId).css("transform","perspective(600px) rotateY(0deg)").css("transition"," transform 0.5s ease-out");
//     // setTimeout(function(){
//     //     $("#"+cellId +" .front_view").toggleClass("visible");
//     //     $("#"+cellId +" .back_view").toggleClass("visible");
//     // },150);

//     $("div.grid_cell").css("transform","perspective(600px) rotateY(0deg)").css("transition"," transform 0.5s ease-out ");
//     setTimeout(function(){
//         $(" .front_view").addClass("visible");
//         $(" .back_view").removeClass("visible");
//     },150);

// });
function flipBackTheCards()
{
    $("div.grid_cell").css("transform","perspective(600px) rotateY(0deg)").css("transition"," transform 0.5s ease-out ");

    setTimeout(function(){
        $(" .front_view").addClass("visible");
        $(" .back_view").removeClass("visible");
    },150);
    
    // $("div.grid_cell").effect("shake",{times:10},1000);


    if(sound==1)
    {
        var aud=new Audio("./sounds/wrong_card.mp3");
        aud.playbackRate=4;
        $(aud).prop("volume",0.15);
        aud.play();
    }
    

    setTimeout(function()
    {
        openedCards=[];
    },1000);
        
}


//function for storing user's input
// function openCard(cellId)
// {
//     // alert(openedCards.length);
// }

// function to check if user's input is correct or not
function checkCards()
{
    var img0=$("#"+openedCards[0]+" .back_view img").attr("src");
    var img1=$("#"+openedCards[1]+" .back_view img").attr("src");
    if(openedCards.length===2)
    {
        var cell1,cell2;
        cell1="#"+openedCards[0];
        cell2="#"+openedCards[1];
        if(img0===img1)
        {
            setTimeout(function(){
                // score++;
                // if(maxScore<score) maxScore=score;
                // $(".score_menu #score").text("Your Score : "+score);
                // $(".score_menu #maxScore").text("High Score : "+maxScore);

                if(sound==1)
                {
                    var aud=new Audio("./sounds/matched_card.mp3");
                    $(aud).prop("volume",0.3);
                    aud.play();
                }
                

                $(cell1).addClass("correct");
                $(cell2).addClass("correct");
                currNoOfPairs--;
                openedCards=[];
                if(currNoOfPairs==0)
                    gameOver();
            },1000);
        }
        else
        {
            setTimeout(flipBackTheCards,800);
        }
    }
}

//function to be executed in case of completion of games
function gameOver(){
    setTimeout(function(){
        $(".game_screen").css("display","none");
        $(".home_screen").css("display","flex");
        flipBackTheCards();
        $("div.grid_cell").removeClass("correct");
    },1000);
}