var column = [];
var points = 0;
var oldPoints = 0;
var clicks = 0;
var level = 0;
var last = false;
var clickable = true;

$(function() {
  $(document).on('click', '.block', function() {
    if( clickable ) {
      var row = $(this).parent();
      var id = row.attr('id');
      var rowArray = [];

      for( var i = 0; i < row.children().length; i++) {
        var selector = '#' + id + ' div:nth-of-type(' + (i + 1) + ')';
        rowArray.push($(selector).attr('class').substring(6));
      }

      column.splice(id.substring(1),1);
      column.unshift(rowArray);

      clicks++;
      $('.clicks').text('Clicks: ' + clicks);
      
      clickable = false;
      BuildColumn();
    }
  });
  $(document).on('click', '.start', function() {
    LoadNextLevel();
    $('.info div').removeClass('hide');
    $('.restart').removeClass('hide');
    $('.rules').addClass('hide');
  });

  $(document).on('click', '#restart', function() {
    Restart();
  });
});

function Restart() {
  points = oldPoints;
  clicks = 0;
  $('.points').text('Points: ' + points);
  $('.clicks').text('Clicks: ' + clicks);
  
  window[ 'Level' + level.toString() ]();
}

function MakeHTML() {
  var str = '';
  var maxWidth = 0;
  var colWidth = '';
  for( i=0; i<column.length; i++ ) {
    str = str.concat('<div id="r' + i + '" class="row clearfix">');
    for( var j = 0; j < column[i].length; j++) {
      str = str.concat('<div class="block"></div>');
    }
    str = str.concat('</div>');
    if( column[i].length > maxWidth ){
      colWidth = (5 * column[i].length).toString() + 'rem';
      maxWidth = column[i].length;
    }
  }
  $('.col').css('width', colWidth);
  $('.col').text("");
  $('.col').append(str);
}

function BuildColumn() {
  $('.points').text('Points: ' + points);
  $('.level').text('Level: ' + level);
  ClearColumn();
  MakeHTML();
  
  if(column.length > 0) {
    for(var i = 0; i < column.length; i++) {
      var row = column[i];
      for(var j = 0; j < row.length; j++) {
        var selector = '#r' + i.toString() + ' div:nth-of-type(' + (j + 1) + ')';
        
        if( row[j] == 'red') {
          $(selector).addClass('red');
        }
        if( row[j] == 'orange') {
          $(selector).addClass('orange');
        }
        if( row[j] == 'yellow') {
          $(selector).addClass('yellow');
        }
        if( row[j] == 'green') {
          $(selector).addClass('green');
        }
        if( row[j] == 'blue') {
          $(selector).addClass('blue');
        }
        if( row[j] == 'purple') {
          $(selector).addClass('purple');
        }
      }
    }
    setTimeout( function() {
      CheckMatch();
    }, 500);
  }
  else {
    LoadNextLevel();
  }
}

function ClearColumn() {
  RemoveRow();
  for(var i = 0; i < column.length; i++) {
    $('#r' + i.toString()).children().removeClass('red');
    $('#r' + i.toString()).children().removeClass('orange');
    $('#r' + i.toString()).children().removeClass('yellow');
    $('#r' + i.toString()).children().removeClass('green');
    $('#r' + i.toString()).children().removeClass('blue');
    $('#r' + i.toString()).children().removeClass('purple');
  }
}

function RemoveRow() {
  for( var i = 0; i < column.length; i++ ) {
    if( column[i].length == 0 ) {
      column.splice(i,1);
      RemoveRow();
      return;
    }
  }
}

function CheckMatch() {
  for(var i = 0; i < column.length; i++) {
    for(var j = 0; j < column[i].length; j++) {
      var check = column[i][j];
      
      if( column.length == 1 ) {
        if( check == column[i][j + 1] && check == column[i][j - 1] ) {
          column[i].splice(j-1,3);
          points += 100;
          BuildColumn();
          return;
        }
      }
      
      else {
        if( i == 0) {
          if( j == 0 ) {
            if( check == column[i + 1][j] && check == column[i][j + 1] ) {
              column[i].splice(j,2);
              column[i+1].splice(j,1);
              points += 100;
              BuildColumn();
              return;
            }
          }
          else {

            if( j == column[i].length - 1 ) {
              if( check == column[i + 1][j] && check == column[i][j - 1] ) {
                column[i].splice(j-1,2);
                column[i+1].splice(j,1);
                points += 100;
                BuildColumn();
                return;
              }
            }
            else {
              if( check == column[i + 1][j] && check == column[i][j + 1] ) {
                column[i].splice(j,2);
                column[i+1].splice(j,1);
                points += 100;
                BuildColumn();
                return;
              }
              if( check == column[i + 1][j] && check == column[i][j - 1] ) {
                column[i].splice(j-1,2);
                column[i+1].splice(j,1);
                points += 100;
                BuildColumn();
                return;
              }
              if( check == column[i][j + 1] && check == column[i][j - 1] ) {
                column[i].splice(j-1,3);
                points += 100;
                BuildColumn();
                return;
              }
            }
          }
        }
        else {
          if( i == column.length - 1 ) {
            if( j == 0 ) {
              if( check == column[i][j + 1] && check == column[i - 1][j] ) {
                column[i].splice(j,2);
                column[i-1].splice(j,1);
                points += 100;
                BuildColumn();
                return;
              }
            }
            else {
              if( j == column[i].length - 1 ) {
                if( check == column[i - 1][j] && check == column[i][j - 1] ) {
                  column[i].splice(j-1,2);
                  column[i-1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
              }
              else {
                if( check == column[i][j + 1] && check == column[i - 1][j] ) {
                  column[i].splice(j,2);
                  column[i-1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
                if( check == column[i][j - 1] && check == column[i - 1][j] ) {
                  column[i].splice(j-1,2);
                  column[i-1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
                if( check == column[i][j + 1] && check == column[i][j - 1] ) {
                  column[i].splice(j-1,3);
                  points += 100;
                  BuildColumn();
                  return;
                }
              }
            }
          }
          else {
            if( j == 0 ) {
              if( check == column[i + 1][j] && check == column[i][j + 1] ) {
                column[i].splice(j,2);
                column[i+1].splice(j,1);
                points += 100;
                BuildColumn();
                return;
              }
              if( check == column[i - 1][j] && check == column[i][j + 1] ) {
                column[i].splice(j,2);
                column[i-1].splice(j,1);
                points += 100;
                BuildColumn();
                return;
              }
              if( check == column[i + 1][j] && check == column[i - 1][j] ) {
                column[i-1].splice(j,1);
                column[i].splice(j,1);
                column[i+1].splice(j,1);
                points += 100;
                BuildColumn();
                return;
              }
            }
            else {
              if( j == column[i].length - 1 ) {
                if( check == column[i + 1][j] && check == column[i][j - 1] ) {
                  column[i].splice(j-1,2);
                  column[i+1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
                if( check == column[i - 1][j] && check == column[i][j - 1] ) {
                  column[i].splice(j-1,2);
                  column[i-1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
                if( check == column[i + 1][j] && check == column[i - 1][j] ) {
                  column[i-1].splice(j,1);
                  column[i].splice(j,1);
                  column[i+1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
              }
              else {
                if( check == column[i + 1][j] && check == column[i][j + 1] ) {
                  column[i].splice(j,2);
                  column[i+1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
                if( check == column[i + 1][j] && check == column[i][j - 1] ) {
                  column[i].splice(j-1,2);
                  column[i+1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
                if( check == column[i - 1][j] && check == column[i][j + 1] ) {
                  column[i].splice(j,2);
                  column[i-1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
                if( check == column[i - 1][j] && check == column[i][j - 1] ) {
                  column[i].splice(j-1,2);
                  column[i-1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
                if( check == column[i][j + 1] && check == column[i][j - 1] ) {
                  column[i].splice(j-1,3);
                  points += 100;
                  BuildColumn();
                  return;
                }
                if( check == column[i + 1][j] && check == column[i - 1][j] ) {
                  column[i-1].splice(j,1);
                  column[i].splice(j,1);
                  column[i+1].splice(j,1);
                  points += 100;
                  BuildColumn();
                  return;
                }
              }
            }
          }
        }
      }
    }
  }
  clickable = true;
}

function LoadNextLevel() {
  if( !last ) {
    if(level > 0) {
      points += Math.floor(1000 / clicks);
      $('.points').text('Points: ' + points);
    }
    clicks = 0;
    $('.clicks').text('Clicks: ' + clicks);
    oldPoints = points;

    window[ 'Level' + (level + 1 ).toString() ]();
  }
  else {
    Win();
  }
}

function Level1() {
  level = 1;
  column = [];
  
  column.unshift(['orange']);
  column.unshift(['orange']);
  column.unshift(['green']);
  column.unshift(['green']);
  column.unshift(['orange']);
  column.unshift(['green']);
  
  BuildColumn();
}

function Level2() {
  level = 2;
  column = [];
  
  column.unshift(['orange']);
  column.unshift(['green']);
  column.unshift(['orange']);
  column.unshift(['green']);
  column.unshift(['orange']);
  column.unshift(['green']);
  
  BuildColumn();
}

function Level3() {
  level = 3;
  column = [];
  
  column.unshift(['orange']);
  column.unshift(['green']);
  column.unshift(['green']);
  column.unshift(['red']);
  column.unshift(['orange']);
  column.unshift(['green']);
  column.unshift(['red']);
  column.unshift(['orange']);
  column.unshift(['red']);
  
  BuildColumn();
}

function Level4() {
  level = 4;
  column = [];
  
  column.unshift(['orange', 'blue']);
  column.unshift(['orange', 'blue']);
  column.unshift(['green', 'red']);
  column.unshift(['green', 'red']);
  column.unshift(['orange', 'blue']);
  column.unshift(['green', 'red']);
  
  BuildColumn();
}

function Level5() {
  level = 5;
  column = [];
  
  column.unshift(['green', 'red']);
  column.unshift(['orange', 'blue']);
  column.unshift(['red', 'red']);
  column.unshift(['orange', 'blue']);
  column.unshift(['orange', 'blue']);
  column.unshift(['green', 'green']);
  
  BuildColumn();
}

function Level6() {
  level = 6;
  column = [];
  
  column.unshift(['blue', 'orange']);
  column.unshift(['red', 'green']);
  column.unshift(['orange', 'orange']);
  column.unshift(['blue', 'red']);
  column.unshift(['blue', 'red']);
  column.unshift(['green', 'green']);
  
  BuildColumn();
}

function Level7() {
  level = 7;
  column = [];
  
  column.unshift(['green', 'blue', 'purple']);
  column.unshift(['yellow', 'orange', 'red']);
  column.unshift(['yellow', 'blue', 'purple']);
  column.unshift(['green', 'orange', 'red']);
  column.unshift(['yellow', 'orange', 'red']);
  column.unshift(['green', 'blue', 'purple']);
  
  BuildColumn();
}

function Level8() {
  level = 8;
  column = [];
  
  column.unshift(['green', 'blue', 'purple']);
  column.unshift(['green', 'orange', 'orange']);
  column.unshift(['yellow', 'red', 'yellow']);
  column.unshift(['blue', 'orange', 'red']);
  column.unshift(['blue', 'yellow', 'red']);
  column.unshift(['green', 'purple', 'purple']);
  
  BuildColumn();
}

function Level9() {
  level = 9;
  column = [];
  
  column.unshift(['purple', 'purple', 'red']);
  column.unshift(['orange', 'green', 'green']);
  column.unshift(['orange', 'purple', 'yellow']);
  column.unshift(['green', 'green', 'yellow']);
  column.unshift(['orange', 'red', 'red']);
  column.unshift(['green', 'green', 'yellow']);
  
  BuildColumn();
}

function Level10() {
  level = 10;
  column = [];
  
  column.unshift(['red', 'red', 'blue']);
  column.unshift(['blue', 'blue', 'red']);
  column.unshift(['purple', 'green', 'green']);
  column.unshift(['purple', 'yellow', 'yellow']);
  column.unshift(['blue', 'red', 'red']);
  column.unshift(['red', 'blue', 'blue']);
  column.unshift(['blue', 'green', 'yellow']);
  column.unshift(['orange', 'blue', 'blue']);
  column.unshift(['purple', 'orange', 'orange']);
  
  BuildColumn();
}

function Level11() {
  level = 11;
  column = [];
  
  column.unshift(['red', 'blue', 'blue', 'red']);
  column.unshift(['yellow', 'purple', 'yellow', 'yellow']);
  column.unshift(['green', 'green', 'orange', 'blue']);
  column.unshift(['red', 'blue', 'red', 'green']);
  column.unshift(['red', 'purple', 'red', 'blue']);
  column.unshift(['blue', 'purple', 'orange', 'orange']);
  
  BuildColumn();
}

function Level12() {
  level = 12;
  column = [];
  
  column.unshift(['blue', 'red', 'blue', 'blue']);
  column.unshift(['red', 'orange', 'red', 'yellow']);
  column.unshift(['purple', 'orange', 'purple', 'purple']);
  column.unshift(['red', 'green', 'yellow', 'yellow']);
  column.unshift(['blue', 'orange', 'green', 'blue']);
  column.unshift(['red', 'red', 'green', 'blue']);
  
  BuildColumn();
}

function Level13() {
  level = 13;
  column = [];
  
  column.unshift(['green', 'green', 'red', 'yellow']);
  column.unshift(['orange', 'purple', 'yellow', 'purple']);
  column.unshift(['green', 'green', 'yellow', 'purple']);
  column.unshift(['blue', 'blue', 'red', 'blue']);
  column.unshift(['purple', 'purple', 'red', 'purple']);
  column.unshift(['green', 'green', 'orange', 'orange']);
  
  BuildColumn();
}

function Level14() {
  level = 14;
  column = [];
  
  column.unshift(['blue', 'blue', 'yellow', 'blue']);
  column.unshift(['yellow', 'purple', 'green', 'green']);
  column.unshift(['green', 'green', 'purple', 'purple']);
  column.unshift(['orange', 'yellow', 'blue', 'blue']);
  column.unshift(['green', 'red', 'green', 'red']);
  column.unshift(['orange', 'orange', 'purple', 'red']);
  column.unshift(['blue', 'yellow', 'purple', 'yellow']);
  column.unshift(['blue', 'yellow', 'red', 'purple']);
  column.unshift(['red', 'red', 'blue', 'blue']);
  
  BuildColumn();
}

function Level15() {
  level = 15;
  column = [];
  
  column.unshift(['purple', 'purple', 'yellow', 'yellow']);
  column.unshift(['yellow', 'yellow', 'green', 'green']);
  column.unshift(['green', 'green', 'purple', 'purple']);
  column.unshift(['purple', 'purple', 'blue', 'blue']);
  column.unshift(['green', 'green', 'red', 'red']);
  column.unshift(['blue', 'blue', 'orange', 'orange']);
  column.unshift(['red', 'red', 'yellow', 'yellow']);
  column.unshift(['orange', 'orange', 'blue', 'blue']);
  column.unshift(['red', 'red', 'orange', 'orange']);
  
  BuildColumn();
}

function Level16() {
  level = 16;
  column = [];
  
  column.unshift(['red', 'green', 'orange', 'orange']);
  column.unshift(['red', 'green', 'purple', 'purple']);
  column.unshift(['yellow', 'orange', 'yellow', 'yellow']);
  column.unshift(['red', 'red', 'green', 'purple']);
  column.unshift(['purple', 'blue', 'red', 'red']);
  column.unshift(['blue', 'green', 'purple', 'blue']);
  column.unshift(['blue', 'green', 'purple', 'orange']);
  column.unshift(['green', 'orange', 'orange', 'yellow']);
  column.unshift(['blue', 'yellow', 'yellow', 'blue']);
  
  BuildColumn();
}

function Level17() {
  level = 17;
  column = [];
  
  column.unshift(['green', 'green', 'red', 'orange']);
  column.unshift(['red', 'orange', 'red', 'orange']);
  column.unshift(['red', 'orange', 'yellow', 'blue']);
  column.unshift(['purple', 'yellow', 'green', 'yellow']);
  column.unshift(['purple', 'yellow', 'green', 'yellow']);
  column.unshift(['green', 'purple', 'blue', 'purple']);
  column.unshift(['blue', 'blue', 'red', 'orange']);
  column.unshift(['red', 'orange', 'green', 'yellow']);
  column.unshift(['blue', 'purple', 'purple', 'blue']);
  
  BuildColumn();
}

function Level18() {
  level = 18;
  column = [];
  
  column.unshift(['green', 'green', 'red', 'green', 'blue']);
  column.unshift(['blue', 'orange', 'red', 'orange', 'orange']);
  column.unshift(['green', 'green', 'blue', 'blue', 'green']);
  column.unshift(['blue', 'yellow', 'red', 'yellow', 'purple']);
  column.unshift(['yellow', 'purple', 'blue', 'red', 'blue']);
  column.unshift(['purple', 'red', 'blue', 'red', 'blue']);
  
  BuildColumn();
}

function Level19() {
  level = 19;
  column = [];
  
  column.unshift(['blue', 'green', 'red', 'green', 'blue']);
  column.unshift(['blue', 'orange', 'blue', 'red', 'red']);
  column.unshift(['green', 'green', 'blue', 'green', 'green']);
  column.unshift(['blue', 'yellow', 'red', 'purple', 'purple']);
  column.unshift(['yellow', 'purple', 'blue', 'red', 'blue']);
  column.unshift(['yellow', 'red', 'blue', 'orange', 'orange']);
  
  BuildColumn();
}

function Level20() {
  level = 20;
  column = [];
  
  column.unshift(['blue', 'blue', 'red', 'purple', 'purple']);
  column.unshift(['green', 'purple', 'yellow', 'red', 'red']);
  column.unshift(['orange', 'green', 'green', 'blue', 'blue']);
  column.unshift(['green', 'blue', 'yellow', 'yellow', 'orange']);
  column.unshift(['red', 'purple', 'green', 'red', 'orange']);
  column.unshift(['blue', 'red', 'green', 'purple', 'purple']);
  
  BuildColumn();
}

function Level21() {
  level = 21;
  column = [];
  
  column.unshift(['green', 'blue', 'purple', 'red', 'purple']);
  column.unshift(['green', 'blue', 'yellow', 'yellow', 'purple']);
  column.unshift(['orange', 'red', 'purple', 'blue', 'blue']);
  column.unshift(['green', 'blue', 'blue', 'yellow', 'orange']);
  column.unshift(['orange', 'red', 'purple', 'red', 'orange']);
  column.unshift(['orange', 'red', 'orange', 'red', 'purple']);
  
  BuildColumn();
}

function Level22() {
  level = 22;
  column = [];
  
  column.unshift(['blue', 'blue', 'red', 'red', 'blue']);
  column.unshift(['green', 'green', 'orange', 'orange', 'green']);
  column.unshift(['orange', 'orange', 'purple', 'purple', 'orange']);
  column.unshift(['yellow', 'blue', 'blue', 'yellow', 'yellow']);
  column.unshift(['purple', 'green', 'orange', 'red', 'red']);
  column.unshift(['purple', 'green', 'orange', 'purple', 'purple']);
  column.unshift(['green', 'blue', 'blue', 'green', 'green']);
  column.unshift(['green', 'yellow', 'orange', 'red', 'yellow']);
  column.unshift(['blue', 'blue', 'orange', 'red', 'yellow']);
  
  BuildColumn();
}

function Level23() {
  level = 23;
  column = [];
  
  column.unshift(['red', 'blue', 'blue', 'green', 'blue']);
  column.unshift(['yellow', 'green', 'orange', 'red', 'green']);
  column.unshift(['yellow', 'blue', 'blue', 'red', 'blue']);
  column.unshift(['red', 'green', 'orange', 'green', 'green']);
  column.unshift(['yellow', 'blue', 'blue', 'red', 'blue']);
  column.unshift(['yellow', 'green', 'orange', 'red', 'green']);
  column.unshift(['red', 'blue', 'blue', 'green', 'blue']);
  column.unshift(['yellow', 'green', 'green', 'red', 'green']);
  column.unshift(['yellow', 'blue', 'blue', 'red', 'blue']);
  
  BuildColumn();
}

function Level24() {
  level = 24;
  column = [];
  
  column.unshift(['red', 'green', 'green', 'blue', 'blue', 'purple']);
  column.unshift(['yellow', 'yellow', 'orange', 'red', 'red', 'purple']);
  column.unshift(['red', 'orange', 'blue', 'yellow', 'yellow', 'red']);
  column.unshift(['red', 'green', 'orange', 'green', 'orange','purple']);
  column.unshift(['purple', 'purple', 'blue', 'purple', 'blue', 'yellow']);
  column.unshift(['green', 'green', 'orange', 'orange', 'blue', 'yellow']);
  
  BuildColumn();
}

function Level25() {
  level = 25;
  last = true;
  column = [];
  
  column.unshift(['green', 'orange', 'blue', 'orange', 'red', 'blue']);
  column.unshift(['green', 'yellow', 'yellow', 'orange', 'red', 'blue']);
  column.unshift(['blue', 'orange', 'blue', 'blue', 'yellow', 'orange']);
  column.unshift(['green', 'orange', 'yellow', 'yellow', 'red','yellow']);
  column.unshift(['purple', 'purple', 'blue', 'purple', 'blue', 'blue']);
  column.unshift(['red', 'red', 'yellow', 'red', 'yellow', 'yellow']);
  
  BuildColumn();
}

function Win() {
  $('body').text('');
  $('body').append('<div class="win">You Win!<div class="win-score">Your final score was:<br/>' + points +'</div><div class="win-text">Congratulations for completing the game! Thanks for taking the time to play through. I hope you enjoyed playing! Feel free to play again and try for a higher score!<br/><br/>Feel free to check out more of my <a href="https://codepen.io/charlie-volpe/">CodePens</a> as well as <a href="http://charlievolpe.com">my website</a>. Post your highscore in the comments if you like!</div></div>');
}