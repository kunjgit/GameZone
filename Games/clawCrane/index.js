var isDragging = false;
var toyOffset;
$(document).ready(function() {
  $("body").on("click","#b_drop",function() {
    toyOffset = $(".toy").offset();
    $("#b_drop,#moveContainer").hide();
    openClaws();
    $("#clawBar").stop().animate({
      "height":"+=180px"
    },{
      duration:1000,
      easing:"linear",
      complete: function() {
      }
    });
    $("#clawALL").stop().animate({
      "top":"+=180px"
    },{
      duration:1000,
      easing:"linear",
      step:function() {
        clawBallOffset = $("#clawBall").offset();
        var horizontalOK = ((clawBallOffset.left-31)<toyOffset.left) && ((clawBallOffset.left+37)>toyOffset.left+50);
        if ((clawBallOffset.top+10)>toyOffset.top && horizontalOK) {
          // WIN (TAKE THE TOY)
          $("#clawALL,#clawBar").stop();
          closeClaws();
          var bgPos = $(".toy").css("background-position");
          var htmlToy = "<div class='toy' style='background-position:"+(bgPos)+";top:35px;left:6px;'></div>";
          $(".toy").remove();
          $("#clawALL").append(htmlToy);
          $("#clawBar").stop().animate({
            "height":"15px"
          },{
            duration:1000,
            easing:"linear",
            complete: function() {
            }
          });
          $("#clawALL").stop().animate({
            "top":"0px"
          },{
            duration:1000,
            easing:"linear",
            complete: function() {
              $("#claw").stop().animate({
                "left":"30px"
              },{
                duration:1000,
                easing:"linear",
                complete: function() {
                  openClaws();
                  $(".toy").stop().animate({
                    "top":"+=260px"
                  },{
                    duration:1000,
                    easing:"linear",
                    complete: function() {
                      $(".toy").css({
                        "z-index":"100",
                        "animation":"fullsize 1s 1 linear",
                        "transform":"scale(4) translate(30px,-30px)"
                      });
                      setTimeout(function() {
                        $(".toy").stop().animate({
                          "opacity":"0"
                        },{
                          duration:500,
                          easing:"linear",
                          complete: function() {
                            $("#moveControl").css("left","-2px");
                            $("#moveContainer").show();
                            $(".toy").remove();
                            placeToy();
                          }
                        });
                      },1500);
                    }
                  });
                  setTimeout(function() {
                    closeClaws();
                  },300);
                }
              });
            }
          });
        }
      },
      complete: function() {
        // LOSE (NO TOY TAKEN)
        closeClaws();
        $("#clawBar").stop().animate({
          "height":"-=180px"
        },{
          duration:1000,
          easing:"linear",
          complete: function() {
          }
        });
        $("#clawALL").stop().animate({
          "top":"-=180px"
        },{
          duration:1000,
          easing:"linear",
          complete: function() {
            $("#claw").stop().animate({
              "left":"30px"
            },{
              duration:1000,
              easing:"linear",
              complete: function() {
                openClaws();
                setTimeout(function() {
                  closeClaws();
                  $("#moveControl").css("left","-2px");
                  $("#moveContainer").show();
                  $(".toy").remove();
                  placeToy();
                },300);
              }
            });
          }
        });
      }
    });
  });
  var horizontal = document.getElementById("moveControl");
  var mc_horizontal = new Hammer(horizontal);
  mc_horizontal.add(new Hammer.Pan({
    direction:Hammer.DIRECTION_HORIZONTAL,threshold:0
  }));
  mc_horizontal.on("pan",handle_horizontal);
  placeToy();
});
function openClaws() {
  $("#rightClaw,#leftClaw").css({
    "transform":"rotate(0deg)"
  });
}
function closeClaws() {
  $("#rightClaw").css({
    "transform":"rotate(30deg)"
  });
  $("#leftClaw").css({
    "transform":"rotate(-30deg)"
  });
}
function placeToy() {
  var col = Math.floor(Math.random()*7);
  var row = Math.floor(Math.random()*7);
  var toyTop = Math.floor(Math.random()*70);
  var toyLeft = Math.floor(Math.random()*160);
  var htmlToy = "<div class='toy' style='background-position:"+(col*50)+"px "+(row*50)+"px;top:"+(toyTop)+"px;left:"+(toyLeft)+"px;'></div>";
  $("#toys").append(htmlToy);
}
function handle_horizontal(ev) {
  var elem = ev.target;
  if (!isDragging) {
    isDragging = true;
    lastPosX = elem.offsetLeft;
  }
  var posX = ev.deltaX + lastPosX;
  if (posX<-2) posX=-2;
  if (posX>193) posX=193;
  elem.style.left = posX + "px";
  var clawPosX = posX*165/193+105;
  $("#claw").css({
    "left":(clawPosX)+"px"
  });
  $("#b_drop").show();
  if (ev.isFinal) {
    isDragging = false;
  }
}
