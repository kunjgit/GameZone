var name1 = "Player1";
var name2 = "Player2";
$(".start").click(function(){
    $(".diceimg").css("opacity","1");

    dicebtn.style.display='block';

 name1= document.getElementById("pl1").value;
 name2= document.getElementById("pl2").value;

if (name1!=name2){
    
    let ctr = 1, c1 = -1, c2 = -1;
    if (name1===""||name2==="") alert("Enter the name.");
    else{
        window.location="#target";
document.getElementById("plr1").innerHTML = name1;
document.getElementById("plr2").innerHTML = name2;
    $(".start").text("New Game");

    $(".pl1path").attr("src","images\\path\\path-1.png");
    $(".pl2path").attr("src","images\\path\\path-1.png");
    $(".turn").text(name1+"\'s turn");

    $(".roll").click(function(){
        //ctr++;
        var num=Math.floor(Math.random()*6+1);
        $(".diceimg").attr("src","images\\dice\\dice" + num + ".png");
        if(num == 6){
            $(".turn").text("Roll Again...");
            if(ctr % 2 == 1){
                if(c1==-1){
                    c1=0;
                }
                else{
                    if(c1 + num <= 9){
                        c1 += num;
                    }
                    else{
                        return;
                    }
                    if(c1==9){
                        $(".pl1path").attr("src","images\\path\\pathvictory.png");
                        $(".turn").text(name1+"\ wins!!");
                        dicebtn.style.display='none';
                      //  $(".turn").hide();
                        $(".diceimg").css("opacity","0.5");
                        return;
                    }
                   // $(".pl1path").attr("src","images\\path\\path" + c1 +".png");
                   // return;
                }
                $(".pl1path").attr("src","images\\path\\path" + c1 +".png");
                return;
            }
            else if(ctr % 2 == 0){
                if(c2==-1){
                    c2=0;
                }
                else{
                    if(c2 + num <= 9){
                        c2 += num;
                    }
                    else{
                        return;
                    }
                    if(c2==9){
                        $(".pl2path").attr("src","images\\path\\pathvictory.png");
                        $(".turn").text(name2+"\ wins!!");
                        dicebtn.style.display='none';
                       // $(".turn").hide();
                        $(".diceimg").css("opacity","0.5");
                        return;
                    }
                   // $(".pl2path").attr("src","images\\path\\path" + c2 +".png");
                   // return;
                }
                $(".pl2path").attr("src","images\\path\\path" + c2 +".png");
                return;
            }
           // ctr--;
        }           //code for when dice rolls six(6)
        else{
            if(ctr % 2 == 0){
                $(".turn").text(name1+"\'s turn");
            }
            else{
                $(".turn").text(name2+"\'s turn");
            }
            if((c1 == -1 && ctr % 2 == 1) || (c2 == -1 && ctr % 2 == 0)){
                ctr++;
                return;
            }
            else if(ctr % 2 == 1){
                    if(c1 + num <= 9){
                        c1 += num;
                    }
                    else{
                        ctr++;
                        return;
                    }
                    if(c1==9){
                        $(".pl1path").attr("src","images\\path\\pathvictory.png");
                        $(".turn").text(name1+"\ wins!!");
                        dicebtn.style.display='none';
                              // $(".turn").hide();
                        $(".diceimg").css("opacity","0.5");
                        return;
                    }
                $(".pl1path").attr("src","images\\path\\path" + c1 +".png");
            }
            else if(ctr % 2 == 0){
                    if(c2 + num <= 9){
                        c2 += num;
                    }
                    else{
                        ctr++;
                        return;
                    }
                    if(c2==9){
                        $(".pl2path").attr("src","images\\path\\pathvictory.png");
                        $(".turn").text(name2+"\ wins!!");
                        dicebtn.style.display='none';
                      //  $(".turn").hide();
                        $(".diceimg").css("opacity","0.5");
                        return;
                    }
                $(".pl2path").attr("src","images\\path\\path" + c2 +".png");
            }
            ctr++;
        }
    });
    if(c1==9 || c2==9){
        return;
    }
}
}
else if (name1===""||name2==="") alert("Enter the name.");
else alert("Names are same, enter different names.")
});

function roll(){
    if(document.getElementById("begin").innerHTML=="Begin Game") {
    alert('Please click "Begin Game".');
    window.location="#landing-container";}
}