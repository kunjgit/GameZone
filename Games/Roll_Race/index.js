var name1 = "Player1";
var name2 = "Player2";
$(".start").click(function(){
    $("#dicebtn").css("visibility","visible");
    //$(".turn").show();
    $(".diceimg").css("opacity","1");
    name1 = prompt("Enter player 1's name : ");
    $(".pl1").text(name1);

    name2 = prompt("Enter player2's name : ");
    $(".pl2").text(name2);

    $(".start").text("New Game");

    $(".pl1path").attr("src","images\\path\\path-1.png");
    $(".pl2path").attr("src","images\\path\\path-1.png");
    $(".turn").text(name1+"\'s turn");

    var ctr = 1, c1 = -1, c2 = -1;
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
                        $("#dicebtn").css("visibility","hidden");
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
                        $("#dicebtn").css("visibility","hidden");
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
                        $(".roll").hide();
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
                        $(".roll").hide();
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
});