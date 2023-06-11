class Board {
    static ROWS   //number of rows
    static COLUMNS   //number of columns
    static BOXES_COUNT //number of boxes
 
    constructor(rows, columns) {
       Board.ROWS = rows
       Board.COLUMNS = columns
       Board.BOXES_COUNT = rows * columns
 
      //uiRoot is the root element of the board
       this.uiRoot = document.querySelector(".board")
       this.setEdgeThickness()
 
      //Below is the code for generation of the board
       this.boxes = new Array(rows).fill(null).map(() => new Array(columns).fill(null))
 
       this.adjacentBoxesToFill = []
       this.isFillingAdjacentBoxes = false
       this.filledBoxes = 0
 
       this.generate()
 
       this.addEdgeClickEventListener()
 
       Game.instance.addEventListener("edgeFill", (edge) =>
          this.onEdgeFill(edge)
       )
       Game.instance.addEventListener("boxFill", (box) => this.onBoxFill(box))
    }
 
   //Setting up the edge thickness based on the number of boxes. 
   //We need to set it for Root UI.
    setEdgeThickness() {
      //The thickness of the edge depends on the number of boxes
       let thickness =
          ( Board.BOXES_COUNT <= 25  ) ? 10 : 
          ( Board.BOXES_COUNT <= 100 ) ? 8 : 
          ( Board.BOXES_COUNT <= 200 ) ? 5 : 3
 
       document.querySelector(":root").style.setProperty("--edge-thikness", `${thickness}px`)
    }
 
   //
    addEdgeClickEventListener() {
       this.uiRoot.addEventListener("click", (e) => {
          if (!this.isFillingAdjacentBoxes) {
             if (e.target.classList.contains("edge")) {
                let edgePosition = e.target.getAttribute("data-position")
                //Getting the row and column of the box so we can write logic to fill the box later
                let r = e.target.parentElement.getAttribute("data-row")
                let c = e.target.parentElement.getAttribute("data-column")
                let box = this.boxes[r][c]
                //Getting the edge object from the box
                let edge = box.getEdge(edgePosition)
                this.onEdgeClick(box, edge)
             }
          }
       })
    }
    //On click of the edge, we need to fill the edge and check if the adjacent boxes can be filled
    onEdgeClick(box, edge) {
       box.fillEdge(edge)
 
      //Get the adjacent filled boxes.
       const adjacentBox = box.getAdjacentBox(edge.position)

       if (adjacentBox != null) 
       adjacentBox.fillEdge(edge.inverseEdge)   
 
       setTimeout(() => {
          if (this.adjacentBoxesToFill.length == 0) Game.instance.switchPlayer()
       }, 100)
    }


 //Check for remaining edges in boxes
    onEdgeFill(edge) {
       const box = edge.box
       box.remainingEdges--
      
       if (box.remainingEdges == 0) {
          this.fillBox(box)
       }
    }
 
   //Check for adjacent boxes to fill
    fillBox(box) {
       this.adjacentBoxesToFill.push(box)
 
       setTimeout(() => this.checkAdjacentadjacentBoxesToFill(box), 100)
 
       if (!this.isFillingAdjacentBoxes) {
          this.isFillingAdjacentBoxes = true
          this.fillBoxes()
       }
    }
 
    onBoxFill(box) {
       this.filledBoxes++
 
       //If all the boxes are filled, then the player wins
       if (this.filledBoxes == Board.BOXES_COUNT)
          Game.instance.invokeEvent("playerWin")
    }
 
    //Board boxes
    generateBoardBoxes() {
       for (let r = 0; r < Board.ROWS; r++)
          for (let c = 0; c < Board.COLUMNS; c++) {
             const box = new Box(r, c)
             this.boxes[r][c] = box
             this.uiRoot.appendChild(box.ui)
          }
 
       //set each box adjacents and inverses
       for (let r = 0; r < Board.ROWS; r++)
          for (let c = 0; c < Board.COLUMNS; c++) {
             let box = this.boxes[r][c]
             box.adjacentBoxes = this.getBoxAdjacents(box)
             box.inverseEdges = this.getBoxInverseEdges(box)
             this.boxes[r][c] = box
          }
    }
 
    generate() {
       this.uiRoot.style.gridTemplate = `repeat(${Board.ROWS}, 1fr) / repeat(${Board.COLUMNS}, 1fr)`
       this.generateBoardBoxes()
    }
 
    getBoxAdjacents(box) {
      //Getting the adjacent boxes
       return {
         //{-1,0} means the box is above the current box
         //{0,1} means the box is to the right of the current box
         //{1,0} means the box is below the current box
         //{0,-1} means the box is to the left of the current box
          top   : (box.row > 0) ? this.boxes[box.row - 1][box.column] : null,
          right : (box.column < Board.COLUMNS - 1) ? this.boxes[box.row][box.column + 1] : null,
          bottom: (box.row < Board.ROWS - 1) ? this.boxes[box.row + 1][box.column] : null,
          left  : (box.column > 0) ? this.boxes[box.row][box.column - 1] : null,
       }
    }
 

    //Inverse edges are the edges of the adjacent boxes
    getBoxInverseEdges(box) {
       const inverseEdgePositions = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right",
       }
       for (const [position, edge] of Object.entries(box.edges)) {
          const inversePosition = inverseEdgePositions[position]
          const adjacentBox = box.getAdjacentBox(position)
          if (adjacentBox != null) //If the adjacent box is not null, then we need to set the inverse edges
             box.inverseEdges[position] = adjacentBox.edges[inversePosition] //Setting the inverse edges
       }
       return box.inverseEdges
    }
 
    checkAdjacentadjacentBoxesToFill(box) {
       for (const [position, adjacentBox] of Object.entries(box.adjacentBoxes)) {
          if (adjacentBox != null) {
             if (!adjacentBox.filled && adjacentBox.remainingEdges == 1) {
                const edge = adjacentBox.getLastRemainingEdge()
                if (edge != null) {
                   this.onEdgeClick(adjacentBox, edge)
                }
             }
          }
       }
    }
 
    fillBoxes() {
       if (this.adjacentBoxesToFill.length != 0) {
          setTimeout(() => {
             const box = this.adjacentBoxesToFill.shift()
             box.fill(Game.instance.currentPlayer.color)
             this.fillBoxes()
          }, 150)
       } else {
          setTimeout(() => {
             this.isFillingAdjacentBoxes = false
             this.adjacentBoxesToFill = []
             //Switch the player
          }, 600)
       }
    }
 }