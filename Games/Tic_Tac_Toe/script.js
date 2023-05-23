var currentPlayer = "X";
    var board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
    
    function makeMove(row, col) {
      if (board[row][col] === "") {
        board[row][col] = currentPlayer;
        document.getElementsByClassName("board")[0].children[row * 3 + col].innerText = currentPlayer;
        
        if (checkWinner(currentPlayer)) {
          alert("Player " + currentPlayer + " wins!");
          resetBoard();
          return;
        }
        
        if (checkBoardFull()) {
          alert("It's a tie!");
          resetBoard();
          return;
        }
        
        currentPlayer = currentPlayer === "X" ? "O" : "X";
      }
    }
    
    function checkWinner(player) {
      // Check rows
      for (var row = 0; row < 3; row++) {
        if (board[row][0] === player && board[row][1] === player && board[row][2] === player) {
          return true;
        }
      }
      
      // Check columns
      for (var col = 0; col < 3; col++) {
        if (board[0][col] === player && board[1][col] === player && board[2][col] === player) {
          return true;
        }
      }
      
      // Check diagonals
      if ((board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
          (board[0][2] === player && board[1][1] === player && board[2][0] === player)) {
        return true;
      }
      
      return false;
    }
    
    function checkBoardFull() {
      for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
          if (board[row][col] === "") {
            return false;
          }
        }
      }
      
      return true;
    }
    
    function resetBoard() {
      currentPlayer = "X";
      board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ];
      
      var cells = document.getElementsByClassName("board")[0].children;
      for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
      }
    }