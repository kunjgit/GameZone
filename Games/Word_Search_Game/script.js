var myWords = ["BANANA", "KIWI", "MANGO", "ORANGE", "APPLE", "WATERMELON", "GRAPES", "PINEAPPLE"];
var tempWords = [];
var selectedWord = "";
var selectedLetters = []; // Array to store selected letter indices

$(document).ready(function() {
    alert("RULES\n1. Words could be displayed horizontally, vertically or diagonally.\n2. To select the letters, press Shift or Cmd key and then click the letters in the correct order and then release the Shift or Cmd key.");
    arrangeGame();

    $(".individual").click(function(event) {
        if (event.shiftKey || event.metaKey) { // Check for Shift or Cmd key
            $(this).addClass("colorPurple");
            selectedWord += $(this).html();
            selectedLetters.push($(this).index()); // Store the index of the selected letter
            console.log(selectedWord);
        }
    });

    $(document).keydown(function() {
        selectedWord = "";
        selectedLetters = []; // Clear the selected letters array
        $(".individual").removeClass("colorPurple");
    }).keyup(function() {
        if (myWords.indexOf(selectedWord) >= 0 && isStraightLine(selectedLetters)) {
            // Check if the word is in the list AND letters are in a straight line
            $(".colorPurple").addClass("correctlySelected");
            $("#hint p").each(function(key, item) {
                if (selectedWord == $(item).html()) {
                    $(this).addClass("done");
                }
                if ($(".done").length == myWords.length) {
                    $("#hint").empty();
                    $("#hint").append("<p id=message> GOOD JOB! </p>");
                }
            });
        }
    });
});
function arrangeGame()
{
    $("#hint").show();
    $.each(myWords, function(key, item){
        $("#hint").append("<p>" + item + "</p>");
    });
    for (var i = 1; i <= 12; i++)
    {
        for (var j = 1; j <= 12; j++)
        {
            $("#letters").append("<div class=individual data-row=" + i + " data-column=" + j + "></div>");         
        }
    }
    placeCorrectLetters(myWords);
    placeCorrectLetters(tempWords);
    $.each($(".individual"), function(key, item){
        if($(item).attr("data-word") == undefined)
            $(this).html(randomLetter());
    })
}
function randomLetter()
{
    var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabets.charAt(Math.floor(Math.random()*26));
}
function checkOccupied(word, starting, orientation)
{
    var status = ""; var incrementBy = 0;
    if(orientation == "row")
        incrementBy = 1;
    else if( orientation == "column")
        incrementBy = 12;
    else if( orientation == "diagonal")
        incrementBy = 13;
    for (var p=starting, q=0; q<word.length;q++)
    {
        if($(".individual:eq(" + p + ")").attr("data-word") == undefined)
            status = "empty";
        else
        {
            status = "occupied";
            break;
        }
        p += incrementBy;
    }
    return status;
}
function placeCorrectLetters(myArr)
{
    var positions = ["row","column","diagonal"];
    var nextLetter = 0; var newStart = 0;
    for (var i = 0; i < myArr.length; i ++)
    {
        var orientation = positions[Math.floor(Math.random()*positions.length)];
        // alert(orientation); // Remove or comment out this line
        var start = Math.floor(Math.random()*$(".individual").length);
        var myRow = $(".individual:eq(" + start + ")").data("row");
        var myColumn = $(".individual:eq(" + start + ")").data("column");
        if (orientation == "row")
            {
                nextLetter = 1;
                if ((myColumn*1) + myArr[i].length <= 12)
                {
                    newStart = start;
                }            
                else
                {
                    var newColumn = 12 - myArr[i].length;
                    newStart = $(".individual [data-row = " + myRow + " ] [data-column = " + newColumn + "]").index();
                }
            }
        else if (orientation == "column")
            {
                nextLetter = 12;
                if ((myRow*1) + myArr[i].length <= 12)
                {
                    newStart = start;
                }
                else
                {
                    var newRow = 12 - myArr[i].length;
                    newStart = $(".individual [data-row =" + newRow + " ] [data-column= " + myColumn + "]").index();
                }    
            }
            else if(orientation == "diagonal")
            {
                nextLetter = 13;
                if((myColumn*1) + myArr[i].length <= 12 && (myRow*1) + myArr[i].length <= 12)
                    newStart = start;
                if((myColumn*1) + myArr[i].length > 12)
                {
                    var newColumn = 12 - myArr[i].length;
                    newStart = $(".individual[data-row=" + myRow + "][data-column=" + newColumn + "]").index();
                }
                if((myRow*1) + myArr[i].length > 12)
                {
                    var newRow = 12 - myArr[i].length;
                    newStart = $(".individual[data-row=" + newRow + "][data-column=" + myColumn + "]").index();
                }
                if((myColumn*1) + myArr[i].length > 12 && (myRow*1) + myArr[i].length > 12)
                {
                    var newColumn = 12 - myArr[i].length;
                    var newRow = 12 - myArr[i].length;
                    newStart = $(".individual[data-row=" + newRow + "][data-column=" + newColumn + "]").index();
                }
            }
            var characters = myArr[i].split("");
            var nextPosition = 0;
            var occupied = checkOccupied(myArr[i], newStart, orientation);
            if (occupied == "empty")
            {
                $.each(characters, function(key, item){
                    $(".individual:eq(" + (newStart + nextPosition) + ")").html(item);
                    $(".individual:eq(" + (newStart + nextPosition) + ")").attr("data-word", myArr[i]);
                    nextPosition += nextLetter;
                })
            }
            else 
            {
                tempWords.push(myArr[i]);
            }
    
    }
}

function isStraightLine(indices) {
    if (indices.length < 2) {
        return false; // Need at least two letters to form a line
    }

    // Calculate differences between consecutive indices
    var differences = indices.slice(1).map((value, index) => value - indices[index]);

    // Check if all differences are the same (indicates a straight line)
    return differences.every(value => value === differences[0]);
}

