const generateLetter = () => {
    var result = '';
    var characters = 'abcdefghijklmaopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i <= 0; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    } return result;
 }
 
 //by default takes 16 due to grid size
 const generateRandomInt = () => {
    return Math.floor(Math.random() * Math.floor(16));
 }
 
 ///
 
 class Tile {
 
    constructor(x,y) {
       this.x = x;
       this.y = y;
       this.tileSize = 50;
       this.letterColor = [0,0,0]
       this.letterData = " "
       this.filled = false;
       this.isPartOfCorrectSequence = false;
    }
 
    isMouseInside(mouseX,mouseY) {
       return mouseX > this.x  && mouseX < this.x + this.tileSize && mouseY > this.y && mouseY < this.y + this.tileSize
    }
 
    setIsPartOf(data) { this.isPartOfCorrectSequence = data; }
    getIsPartOf() { return this.isPartOfCorrectSequence; }
 
    setFilled(data) { this.filled = data; }
    getFilled()     { return this.filled; }
    getData()       { return this.letterData; }
    setData(data)   { this.letterData = data; }
 
    render() {
 
       rect(this.x, this.y, this.tileSize, this.tileSize);
       
       //setting selected letter color
       if(this.filled == true) fill(255,0,0)
       else fill(0,0,0)
       
       text(this.letterData,this.x+24,this.y+24)
       fill(255)
     }
 }
 
 ///
 
 class Board {
 
    placeHorizontal(row,col,word) {
       for(var i = 0; i <= word.length-1; i++) {
          this.boardContainer[row][col++].setData(word[i])
       }
    }
 
    canPlaceHorizontal(col,size) {
       return (col-size == 0);
    }
 
    isAllClearHorizontal(row,col,word) {
       if(this.canPlaceHorizontal(col,word.length)) {
          for(var i = 0; i <= word.length; i++) {
             if(this.boardContainer[row][col++].getData() != " ") {
                return false;
                break;
             }
          }
       } return true;
    }
 
    placeVertical(row,col,word) {
       for(var i = 0; i <= word.length-1; i++) {
          this.boardContainer[row++][col].setData(word[i])
       }
    }
 
    canPlaceVertical(row,size) {
       return (row-size == 0);
    }
 
    isAllClearVertical(row,col,word) {
       if(this.canPlaceVertical(row,word.length)) {
          for(var i = 0; i <= word.length; i++) {
             if(this.boardContainer[row++][col].getData() != " ") {
                return false;
                break;
             }
          }
       } return true;
    }
 
    placeDiagonal(row,col,word) {
       for(var i = 0; i <= word.length-1; i++) {
          this.boardContainer[row++][col++].setData(word[i])
       }
    }
 
    canPlaceDiagonal(row,col,size) {
       return (row <= size && col <= size);
    }
 
    isAllClearDiagonal(row,col,word) {
       if(this.canPlaceDiagonal(row,col,word.length)) {
          for(var i = 0; i <= word.length; i++) {
             if(this.boardContainer[row++][col++].getData() != " ") {
                return false;
                break;
             }
          }
       } return true;
    }
 
    generatePlace(word) {
 
       let row = generateRandomInt();
       let col = generateRandomInt();
 
       if(!this.canPlaceHorizontal(col,word.length)) {
          if(!this.canPlaceVertical(row,word.length)) {
             if(!this.canPlaceDiagonal(row,col,word.length)) {
                return false;
             } else {
                if(this.isAllClearDiagonal(row,col,word)) {
                   this.placeDiagonal(row,col,word)
                   return true;
                }
             }
          } else {
             if(this.isAllClearVertical(row,col,word)) {
                this.placeVertical(row,col,word);
                return true;
             }
          }
       } else {
          if(this.isAllClearHorizontal(row,col,word)) {
             this.placeHorizontal(row,col,word);
             return true;
          }
       }
    }
 
    constructor() {
 
       this.boardContainer = []
       this.wordList = []
       this.wordLimit = 7
 
       this.genWordList = ["turbo","food","zombie","alien","human","lambda","word","search","puzzle","games","program","loser","cipher","dog","man"];
 
       //This basically intializes the board pieces
       for(var i = 0; i <= 15; i++) {this.boardContainer[i] = []; }
 
       let xx = 0;
       let yy = 0;
       for(var i = 0; i <= 15; i++) {
          for(var j = 0; j <= 15; j++) {
             this.boardContainer[i][j] = new Tile(xx,yy)
             xx += 55
          } xx = 0; yy += 55;
       }
 
       //generates the puzzle
       let count = 0;
       let flag = false;
 
       while(count <= this.genWordList.length-1) {
          if(!flag) {
             flag = this.generatePlace(this.genWordList[count])
          } else {
             count += 1;
             flag = false;
          }
       }
 
       //fill the empty spaces
       for(var i = 0 ; i <= 15; i++) {
          for(var j = 0; j <= 15; j++) {
             if(this.boardContainer[i][j].getData() == " ") {
                this.boardContainer[i][j].setData(generateLetter())
             }
          }
       }
 
    }
 
    clearSelection() {
        for(var i = 0; i <= 15; i++) {
          for(var j = 0; j <= 15; j++) {
             if(this.boardContainer[i][j].getFilled() && this.boardContainer[i][j].getIsPartOf() == false) {
                this.boardContainer[i][j].setFilled(false)
             }
          }
       }
    }
 
    mouseReleased() {
 
       //1.join all letters
       //2.if all letters == genWord
       //3.all letters of that tile are partOf 
       //4.set flag of partOf .. so they do not get cleared
 
       let completedWord = ""
       this.wordList.forEach((letter) => {
          completedWord += letter.getData();
       })
 
       if(this.genWordList.includes(completedWord)) {
          this.wordList.forEach((letter) => {
             letter.setIsPartOf(true);
          })
       }
 
       this.wordList = []
       this.clearSelection();
    }
 
    update(mouseX,mouseY,dragStatus) {
       if(this.wordList.length == 7) {
          dragStatus = false
       } else if(dragStatus == true) {
          for(var i = 0; i <= 15; i++) {
              for(var j = 0; j <= 15; j++) {
                let letter = this.boardContainer[i][j];
                if(letter.isMouseInside(mouseX,mouseY) && letter.getFilled() == false) {
                   letter.setFilled(true);
                   this.wordList.push(letter) 
                }  
             }
          }
       }
    }
 
    render() {
       for(var i = 0; i <= 15; i++) {
          for(var j = 0; j <= 15; j++) {
             this.boardContainer[i][j].render();
          }
       }
    }
 }
 
 ///
 
 let board = new Board();
 let mouseDrag = false;
 
 function setup() {
    createCanvas(823,823)
    textSize(35)
    textAlign(CENTER, CENTER);
    cursor(CROSS);
 }
 
 function mousePressed() {
    mouseDrag = true;
 }
 
 function mouseReleased() {
    mouseDrag = false;
    board.mouseReleased();
 }
 
 function mouseDragged() {
    if(mouseDrag) board.update(mouseX,mouseY,mouseDrag)
 }
 
 function draw() {
    board.render();  
 }