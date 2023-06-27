/*

PACKABUNCHAS

by Mattia Fortunati
http://www.mattiafortunati.com
mattia@mattiafortunati.com

This game is made for the 2021 edition of js13kgames.

As you can see, this code is really messy, full of mistakes and unused/redundat/unoptimized/workaroundy/copypasted things.
It would have been great to optimize and beautify it, but I couldn't really make it in time for the js13k deadline!
So, if you want to check it for any reason, do it at your own risk :D

*/



/*
===============================================   VARS   ===============================================
*/

//versionN = 0.3

c = document.getElementById("v");
ctx = c.getContext("2d");
w = v.width
h = v.height
mouseX = 0
mouseY = 0
startingMouseX = 0
startingMouseY = 0
isMousePressed = false
bgPos = {
	x: 0,
	y: 0
}
recPos = {
	x: w / 2,
	y: h / 2
}
titlePos = {
	x: w / 2,
	y: h * 0.9
}
menuTextPos = {
	x: w / 2,
	y: 3000
}
modeTextPos = {
	x: w / 2,
	y: -1500
}
storyTextPos = {
	x: w / 2,
	y: 100
}
helpCharPos = {
	x: 45,
	y: h + 100
}

textPos = {
	x: 280,
	y: h + 100
}
//score
pTextPos = {
	x: w / 2,
	y: 3000
}



numberOfPolyominos = 4
sizeOfPolyominos = 4
mixed = false
//starting additional area spaces
margin = 0

gameModes = ["CLASSIC", "PENTA", "MIX", "KIDS", "EZPZ", ]
currentGameMode = parseInt(loadData("currentGameMode", "0"))


gridOffsetX = 0

menuText = gameModes[currentGameMode]


lerpSpeed = 0.1

mylatesttap = 0
bottomTextText = ""

polyLeft = parseInt(loadData("polyLeft", "13"))
currentPolyTextToShow = polyLeft



blockSize = w / 13
bSize = blockSize / 2

GENERATING = false

pieces = []
draggedBlock = null
lastDraggedBlock = null
solution = null
bag = {}
buttons = []

isCinematic = false
endCinematicState = 999
center2Alpha = 0
toDrawPieces = true
overlayAlpha = 0
fireCounter = 0
fireAddendum = 5
showFire = false
showLoading = false
//saveData("storyState", "0")
storyState = parseInt(loadData("storyState", "0"))
/*
story states 
0 = has to show intro
1 = has showed intro, has to show middle story
2 = is showing middle story
3 = has showed middle story, has to show ending
4 = is showing ending
*/
//storyState = 0
canSkip = false
skipState = 0
//can skip is a working var for story and

mouthCounter = 0
mouthAddendum = 5
animateMouth = false

gameStarted = false


lastLoop = new Date();

music = null

state = "title"

musicVolume = .1
effectVolume = 1

//muted = false
muted = loadData("muted", "false") == "true"


leftButton = createButton(w * 0.2, h * 0.55, 100, 100, "<", 70, -5, 22, function() {
	changeMode(-1)
})
buttons.push(leftButton)

rightButton = createButton(w * 0.8, h * 0.55, 100, 100, ">", 70, 5, 22, function() {
	changeMode(1)
})
buttons.push(rightButton)

startButton = createButton(w * 0.5, h * 0.6, 140, 350, "START", 70, 0, 25, goToGame)
buttons.push(startButton)

backButton = createButton(w * 0.1, h * 0.06, 100, 100, "<", 70, -5, 22, backToMenu)
buttons.push(backButton)

muteButton = createButton(w * 0.90, h * 0.06, 120, 120, "", 70, 0, 0, mute)
buttons.push(muteButton)

fullScreenButton = createButton(-1500, h * 0.06, 120, 120, "", 70, 0, 0, toggleFullscreen)
buttons.push(fullScreenButton)


leftButton.originalx = -10000
leftButton.x = -10000
rightButton.originalx = 10000
rightButton.x = 10000
startButton.originaly = 10000
startButton.y = 10000
backButton.originalx = -1000
backButton.x = -500


helpTimeout = null
showTutorial = loadData("showTutorial", "true") == "true"


message = {
	text: ["", ""],
	act: 0,
	tct: 0,
	x: 100,
	y: 100,
	timeout: null,
	stayOnEnd: false,
	isPressed: false,
	restart: function() {
		this.phrase = 0
		this.letter = 0
		this.timeout = window.setTimeout(writeText, 50)
	}
}


storyMessage = {
	message: ["", ""],
	act: 0,
	tct: 0,
	x: 100,
	y: 100,
	timeout: null,
	stayOnEnd: false,
	restart: function() {
		this.phrase = 0
		this.letter = 0
		this.timeout = window.setTimeout(writeStoryMessage, 50)
	}
}

storyTimeOut = null



/*
===============================================   UPDATE   ===============================================
*/



function update() {



	//set mouse icon
	if (isMousePressed == true) {
		document.body.style.cursor = "grabbing"
	} else {
		document.body.style.cursor = "grab"
	}

	//"animate" score change
	if (currentPolyTextToShow > polyLeft) {
		currentPolyTextToShow -= 1
	}

	checkIfPiecesOutside()
	alignPieces()

	//Draw
	draw()

	requestAnimationFrame(update)

}

function checkIfPiecesOutside() {
	pieces.find(currentPiece => {
		if (!currentPiece.isDragged == true) {
			for (let i = 0; i < currentPiece.blocks.length; i++) {
				currentBlock = currentPiece.blocks[i]
				if (currentBlock[0] * blockSize + currentPiece.originalPosition.x < blockSize) {
					currentPiece.originalPosition.x += bSize
				} else if (currentBlock[0] * blockSize + currentPiece.originalPosition.x > w - blockSize) {
					currentPiece.originalPosition.x -= bSize
				} else if (currentBlock[1] * blockSize + currentPiece.originalPosition.y < blockSize) {
					currentPiece.originalPosition.y += bSize
				} else if (currentBlock[1] * blockSize + currentPiece.originalPosition.y > h - blockSize) {
					currentPiece.originalPosition.y -= bSize
				}
			}
		}

	})
}



function alignPieces() {
	//align every piece to grid
	pieces.find(piece => {
		if (draggedBlock != piece) {
			//trickier than it seems to align to an offset grid :)
			//original pos + offset = flor(round((original pos + offset))/cell)*cell
			piece.originalPosition.x = Math.floor(Math.round((piece.originalPosition.x + gridOffsetX) / blockSize) * blockSize) - gridOffsetX
			piece.originalPosition.y = Math.floor(Math.round(piece.originalPosition.y / blockSize) * blockSize)

			var COLL = collideWithOtherPieces(piece, pieces)
			if (COLL != false && COLL != draggedBlock) {
				if (piece.originalPosition.x <= COLL.originalPosition.x) {
					piece.originalPosition.x -= bSize
				} else if (piece.originalPosition.x > COLL.originalPosition.x) {
					piece.originalPosition.x += bSize
				}
				if (piece.originalPosition.y <= COLL.originalPosition.y) {
					piece.originalPosition.y -= bSize
				} else if (piece.originalPosition.y > COLL.originalPosition.y) {
					piece.originalPosition.y += bSize
				}
			}
		}

	})
}


function setLoadingColor() {
	cc = ["#C2FDFF", "#FFC886", "#94DEC3", "#D8D0FF", "#FED1E6", "#7DC864", "#FF7E64", "#FDF3BD"]
	loadingColor = cc[Math.floor(Math.random() * cc.length)]
}



function setStartingColors() {

	bgColor = "#94DEC3"
	planetColor = "#FED1E6"
	sunColor = "#FDF3BD"
	smallPlanetColor = "#FFC886"
	bagColor = "#7DC864"

	smallPlanet = 1
	planetCraters = 0
	sunCraters = 0
	halfSun = 1

}


function setBgColors() {
	//var colors = ["#A09CF1", "#94DEC3", "#D8D0FF", "#FED1E6"]
	//var colors = ["#FFEA7E", "#C2FDFF", "#FFC886", "#94DEC3", "#D8D0FF", "#FED1E6", "#7DC864", "#FF7E64", "#FDF3BD"] //,"#DD558E"
	var cc = ["#A09CF1", "#94DEC3", "#D8D0FF", "#FED1E6"]
	bgColor = cc[Math.floor(Math.random() * cc.length)]

	while (true) {
		var cc = ["#C2FDFF", "#FFC886", "#94DEC3", "#D8D0FF", "#FED1E6", "#7DC864", "#FDF3BD"]
		planetColor = cc[Math.floor(Math.random() * cc.length)]
		if (planetColor != bgColor) break
	}

	while (true) {
		var cc = ["#FFEA7E", "#C2FDFF", "#FFC886", "#94DEC3", "#D8D0FF", "#FED1E6", "#7DC864", "#FF7E64", "#FDF3BD"]
		sunColor = cc[Math.floor(Math.random() * cc.length)]
		if (sunColor != bgColor && sunColor != planetColor) break
	}

	while (true) {
		var cc = ["#FFEA7E", "#C2FDFF", "#FFC886", "#94DEC3", "#D8D0FF", "#FED1E6", "#7DC864", "#FF7E64", "#FDF3BD"]
		smallPlanetColor = cc[Math.floor(Math.random() * cc.length)]
		if (smallPlanetColor != bgColor && smallPlanetColor != planetColor && smallPlanetColor != sunColor) break
	}

	while (true) {
		var cc = ["#FFEA7E", "#C2FDFF", "#FFC886", "#94DEC3", "#D8D0FF", "#FED1E6", "#7DC864", "#FF7E64", "#FDF3BD"]
		bagColor = cc[Math.floor(Math.random() * cc.length)]
		if (bagColor != bgColor && bagColor != planetColor) break
	}

	smallPlanet = Math.random() < 0.5 ? -1 : 1
	planetCraters = Math.random() < 0.5 ? -1 : 1
	sunCraters = Math.random() < 0.5 ? -1 : 1
	halfSun = Math.random() < 0.5 ? -1 : 1

}



/*
===============================================   DRAW   ===============================================
*/

function drawPieces() {

	//draw bag
	ctx.lineWidth = 3
	var xx = 0 - mouseX / 200
	var yy = 0 - mouseY / 200
	var newX = xx + bag.originalPosition.x
	var newY = xx + bag.originalPosition.y

	bag.position.x = lerp(bag.position.x, newX, lerpSpeed)
	bag.position.y = lerp(bag.position.y, newY, lerpSpeed)

	var minX = 0
	var maxX = 0
	var minY = 0
	var maxY = 0

	bag.blocks.find(b => {
		minX = Math.min(minX, b[0])
		maxX = Math.max(maxX, b[0])
		minY = Math.min(minY, b[1])
		maxY = Math.max(maxY, b[1])
	})

	var ww = (maxX - minX) + 1
	var hh = (maxY - minY) + 1

	//left
	ctx.save();
	ctx.translate(bag.position.x + minX * blockSize - bSize - bSize / 2 - 10, bag.position.y + minY * blockSize - bSize - bSize / 2 - 10)
	ctx.beginPath();
	ctx.lineWidth = 20
	ctx.strokeStyle = "#5D4E51"
	ctx.fillStyle = "#5D4E51"
	var vertices = [{
		x: ww * blockSize + bSize + bSize / 2,
		y: hh * blockSize + bSize
	}, {
		x: ww * blockSize + bSize + bSize / 2,
		y: hh * blockSize / 2
	}, {
		x: ww * blockSize + bSize + bSize / 2 + 100,
		y: hh * blockSize + bSize
	}];
	roundedPoly(vertices, 5)
	ctx.stroke()
	ctx.fill()
	ctx.restore()
	//right
	ctx.save();
	ctx.translate(bag.position.x + minX * blockSize - bSize - bSize / 2 - 10, bag.position.y + minY * blockSize - bSize - bSize / 2 - 10)
	ctx.beginPath();
	ctx.lineWidth = 20
	ctx.strokeStyle = "#5D4E51"
	ctx.fillStyle = "#5D4E51"
	var vertices = [{
		x: 0,
		y: hh * blockSize + bSize
	}, {
		x: 0,
		y: hh * blockSize / 2
	}, {
		x: -100,
		y: hh * blockSize + bSize
	}];
	roundedPoly(vertices, 5)
	ctx.stroke()
	ctx.fill()
	ctx.restore()


	//fire
	if (showFire == true) {
		fireCounter += fireAddendum
		if (fireCounter <= 0) {
			fireAddendum = 5
		} else if (fireCounter >= 50) {
			fireAddendum = -5
		}
		ctx.save();
		ctx.translate(bag.position.x + minX * blockSize - bSize - bSize / 2 + (ww * blockSize / 2) - bSize, bag.position.y + maxY * blockSize + blockSize)
		ctx.beginPath();
		ctx.fillStyle = "#FF9E67"
		ctx.ellipse(60, 0, 50, 150 + fireCounter, 0, 0, 2 * Math.PI);
		ctx.fill()
		ctx.beginPath();
		ctx.fillStyle = "#FEE66C"
		ctx.ellipse(60, 0, 25, 100 + fireCounter, 0, 0, 2 * Math.PI);
		ctx.fill()
		ctx.restore()
	}


	//bottom 1
	ctx.save();
	ctx.translate(bag.position.x + minX * blockSize - bSize - bSize / 2 + (ww * blockSize / 2) - bSize, bag.position.y + maxY * blockSize + blockSize + 60)
	ctx.beginPath();
	ctx.lineWidth = 20
	ctx.strokeStyle = "#5D4E51"
	ctx.fillStyle = "#5D4E51"
	var vertices = [{
		x: 0,
		y: 0
	}, {
		x: 20,
		y: -100
	}, {
		x: 100,
		y: -100
	}, {
		x: 120,
		y: 0
	}];
	roundedPoly(vertices, 5)
	ctx.stroke()
	ctx.fill()
	ctx.restore()



	//center
	ctx.save();
	ctx.translate(bag.position.x + minX * blockSize - bSize - bSize, bag.position.y + minY * blockSize)
	ctx.beginPath();
	ctx.lineWidth = 20
	ctx.strokeStyle = "#5D4E51"
	ctx.fillStyle = bagColor
	var vertices = [{
		x: 30,
		y: -80
	}, {
		x: (ww * blockSize) / 2 + bSize,
		y: -hh / 2 * blockSize - 80
	}, {
		x: ww * blockSize + bSize - 30 + bSize,
		y: -80
	}, {
		x: ww * blockSize + bSize + bSize,
		y: hh * blockSize
	}, {
		x: 0,
		y: hh * blockSize
	}];
	roundedPoly(vertices, 90)
	ctx.stroke()
	ctx.fill()
	ctx.restore()

	ctx.save()
	ctx.clip()
	ctx.translate(bag.position.x + minX * blockSize - bSize - bSize, bag.position.y + minY * blockSize)
	ctx.fillStyle = "#5D4E51"
	ctx.roundRect(0, -hh / 2 * blockSize - 80, w, hh / 2 * blockSize, 0)
	ctx.fill()

	ctx.restore()



	bag.blocks.find(b => {
		ctx.save();
		ctx.translate(bag.position.x + blockSize * b[0], bag.position.y + blockSize * b[1])
		ctx.lineWidth = 4
		ctx.beginPath();
		ctx.globalAlpha = 1
		//ctx.rect(-blockSize / 2, -blockSize / 2, blockSize, blockSize);
		ctx.roundRect(-blockSize / 2, -blockSize / 2, blockSize, blockSize, 10)
		ctx.strokeStyle = "#5D4E51"
		ctx.stroke()
		ctx.globalAlpha = 0.1
		ctx.fillStyle = "#000"
		ctx.fill()
		ctx.globalAlpha = 1
		ctx.restore()


	})



	//draw pieces
	if (toDrawPieces == true) {


		for (let j = 0; j < pieces.length; j++) {
			var piece = pieces[j]

			//check lerp
			var xx = 0 - mouseX / 200
			var yy = 0 - mouseY / 200
			var newX = xx + piece.originalPosition.x
			var newY = xx + piece.originalPosition.y

			//move lerp
			piece.position.x = lerp(piece.position.x, newX, lerpSpeed)
			piece.position.y = lerp(piece.position.y, newY, lerpSpeed)


			//draw piece blocks
			piece.blocks.find(b => {
				//for every block
				ctx.save();
				//get block position
				var bx = piece.position.x + blockSize * b[0]
				var by = piece.position.y + blockSize * b[1]

				ctx.translate(bx, by)

				//bg pieces transparent
				ctx.lineWidth = 2
				ctx.globalAlpha = 0.5
				ctx.roundRect(-blockSize / 2, -blockSize / 2, blockSize, blockSize, 10)
				ctx.fillStyle = piece.fillColor
				//currently moving
				if (draggedBlock == piece) {
					ctx.fillStyle = "#fff"
				}
				ctx.fill()
				ctx.globalAlpha = 1
				ctx.restore()


				//DRAW BORDERS
				//size of borders
				var size = bSize * 1.6
				var roundness = 15
				//center
				ctx.fillStyle = "#5D4E51"
				ctx.roundRect(bx - size / 2, by - size / 2, size, size, roundness)
				ctx.fill()
				//top
				if (piece.containsCurrentPosition(bx, by - blockSize)) {
					ctx.roundRect(bx - size / 2, by - size, size, size, roundness)
					ctx.fill()

				}
				//bottom
				if (piece.containsCurrentPosition(bx, by + blockSize)) {
					ctx.roundRect(bx - size / 2, by, size, size, roundness)
					ctx.fill()
				}
				//left
				if (piece.containsCurrentPosition(bx - blockSize, by)) {
					ctx.roundRect(bx - size, by - size / 2, size, size, roundness)
					ctx.fill()
				}
				//right
				if (piece.containsCurrentPosition(bx + blockSize, by)) {
					ctx.roundRect(bx, by - size / 2, size, size, roundness)
					ctx.fill()
				}

				//draw internal part
				//size of interal part
				//
				var sizeColored = bSize * 1.2
				//center
				ctx.fillStyle = piece.fillColor
				ctx.roundRect(bx - sizeColored / 2, by - sizeColored / 2, sizeColored, sizeColored, roundness)
				ctx.fill()
				//top
				if (piece.containsCurrentPosition(bx, by - blockSize)) {
					ctx.roundRect(bx - sizeColored / 2, by - sizeColored * 2, sizeColored, sizeColored * 2, roundness)
					ctx.fill()
				}
				//bottom
				if (piece.containsCurrentPosition(bx, by + blockSize)) {
					ctx.roundRect(bx - sizeColored / 2, by, sizeColored, sizeColored * 2, roundness)
					ctx.fill()
				}
				//left
				if (piece.containsCurrentPosition(bx - blockSize, by)) {
					ctx.roundRect(bx - sizeColored * 2, by - sizeColored / 2, sizeColored * 2, sizeColored, roundness)
					ctx.fill()
				}
				//right
				if (piece.containsCurrentPosition(bx + blockSize, by)) {
					ctx.roundRect(bx, by - sizeColored / 2, sizeColored * 2, sizeColored, roundness)
					ctx.fill()
				}
			})

			if (piece.type == "striped") {
				piece.blocks.find(b => {
					//for every block
					//get block position
					var bx = piece.position.x + blockSize * b[0]
					var by = piece.position.y + blockSize * b[1]

					var size = bSize * 1.6
					var roundness = 15
					ctx.globalAlpha = b[2]
					//center
					ctx.fillStyle = "#000"
					ctx.roundRect(bx - size / 2, by - size / 2, size, size, roundness)
					ctx.fill()
					ctx.globalAlpha = 1
				})
			} else if (piece.type == "pois") {

				piece.blocks.find(b => {
					//for every block
					//get block position
					var bx = piece.position.x + blockSize * b[0]
					var by = piece.position.y + blockSize * b[1]

					//draw stripes
					ctx.globalAlpha = 0.1
					//draw internal stripes
					//size of interal part
					ctx.fillStyle = "#000"
					//not top not bottom
					var tp = 1
					if (Math.abs(piece.blocks.indexOf(b) % 2) == 1) {
						tp = 2
					}
					var size2 = 8
					if (b != piece.blocks[piece.eyeBlock]) {
						//ctx.fillRect(bx - sizeColored3 / 2, by - sizeColored2, sizeColored3, sizeColored2 * 2)
						//ctx.fill()
						if (tp == 1) {
							ctx.beginPath();
							ctx.arc(bx - size2, by - size2, size2 + 1, 0, 2 * Math.PI);
							ctx.fill();

							ctx.beginPath();
							ctx.arc(bx + size2, by + size2, size2 - 1, 0, 2 * Math.PI);
							ctx.fill();
						} else {
							ctx.beginPath();
							ctx.arc(bx + size2, by - size2, size2 + 1, 0, 2 * Math.PI);
							ctx.fill();

							ctx.beginPath();
							ctx.arc(bx - size2, by + size2, size2 - 1, 0, 2 * Math.PI);
							ctx.fill();
						}

					}
					ctx.globalAlpha = 1
				})
			}


			//DRAW EYES

			var currentBlock = piece.blocks[piece.eyeBlock]
			var bx = piece.position.x + blockSize * currentBlock[0]
			var by = piece.position.y + blockSize * currentBlock[1]

			var eyeSize = 14

			ctx.beginPath();
			ctx.fillStyle = "#5D4E51"
			ctx.arc(bx - bSize / 5, by, eyeSize, 0, 2 * Math.PI);
			ctx.fill();

			ctx.beginPath();
			ctx.arc(bx + bSize - bSize / 5, by, eyeSize, 0, 2 * Math.PI);
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = "#fff"
			ctx.arc(bx + bSize / 15 - bSize / 5, by - bSize / 15, eyeSize / 2.5, 0, 2 * Math.PI);
			ctx.fill();

			ctx.beginPath();
			ctx.arc(bx + bSize + bSize / 15 - bSize / 5, by - bSize / 15, eyeSize / 2.5, 0, 2 * Math.PI);
			ctx.fill();

		}
	}



	//center2
	ctx.save();
	if (endCinematicState == 0) {
		center2Alpha += 0.05
	} else if (endCinematicState == 1) {
		bag.originalPosition.y -= 60
	}
	ctx.globalAlpha = center2Alpha

	ctx.translate(bag.position.x + minX * blockSize - bSize - bSize, bag.position.y + minY * blockSize)
	ctx.beginPath();
	ctx.lineWidth = 20
	ctx.strokeStyle = "#5D4E51"
	ctx.fillStyle = bagColor
	var vertices = [{
		x: 30,
		y: -80
	}, {
		x: (ww * blockSize) / 2 + bSize,
		y: -hh / 2 * blockSize - 80
	}, {
		x: ww * blockSize + bSize - 30 + bSize,
		y: -80
	}, {
		x: ww * blockSize + bSize + bSize,
		y: hh * blockSize
	}, {
		x: 0,
		y: hh * blockSize
	}];
	roundedPoly(vertices, 90)
	ctx.stroke()
	ctx.fill()
	ctx.restore()

	ctx.save()
	ctx.clip()
	ctx.globalAlpha = center2Alpha
	ctx.translate(bag.position.x + minX * blockSize - bSize - bSize, bag.position.y + minY * blockSize)
	ctx.fillStyle = "#5D4E51"
	ctx.roundRect(0, -hh / 2 * blockSize - 80, w, hh / 2 * blockSize, 0)
	ctx.fill()



	ctx.restore()

	ctx.save()
	//if ww is odd
	var offs = 0
	if (Math.abs(ww % 2) != 1) {
		offs = -bSize
	}

	var sss = Math.min(ww, hh)

	ctx.translate(bag.position.x + maxX * blockSize - sss / 4 * blockSize, bag.position.y + bSize / 2 + maxY * blockSize - sss / 6 * blockSize)
	ctx.scale(0.08 * sss, 0.08 * sss)
	ctx.rotate(-0.2, -0.2)

	ctx.globalAlpha = center2Alpha * 0.5

	ctx.strokeStyle = "#5D4E51";
	ctx.fillStyle = "#5D4E51";
	ctx.beginPath();
	ctx.lineWidth = 20
	var sX = 650
	var sY = 350
	ctx.roundRect(-sX / 2, -sY / 2, sX, sY, 45)
	ctx.stroke();

	//

	ctx.font = "bold 170px Tahoma";

	ctx.textAlign = "center";
	ctx.save()
	ctx.fillText("PACKA", 0, 0);
	ctx.restore()
	ctx.save()
	ctx.font = "bold 118px Tahoma";
	ctx.fillText("BUNCHAS", 0, 0 + 120);
	ctx.restore()
	ctx.restore()

	ctx.globalAlpha = 1


}

function drawButtons() {
	ctx.strokeStyle = "#5D4E51";
	for (let bb = 0; bb < buttons.length; bb++) {

		var currentButton = buttons[bb]
		var xx = 0 - mouseX / 80
		var yy = 0 - mouseY / 80
		var newX = xx + currentButton.originalx
		var newY = yy + currentButton.originaly

		currentButton.x = lerp(currentButton.x, newX, lerpSpeed)
		currentButton.y = lerp(currentButton.y, newY, lerpSpeed)
		//draw bg
		if (currentButton.isPressed == true) {
			ctx.globalAlpha = 0.5
		}
		var roundness = 90
		if (currentButton == muteButton || currentButton == fullScreenButton) roundness = 10
		ctx.fillStyle = "#FFEA7E";
		ctx.roundRect(currentButton.x - currentButton.w / 2, currentButton.y - currentButton.h / 2, currentButton.w, currentButton.h, roundness)
		ctx.lineWidth = 5
		ctx.fill()
		ctx.stroke()

		if (currentButton == muteButton) {

			ctx.fillStyle = "#5D4E51";
			var scal = 0.8
			ctx.save()
			ctx.scale(scal, scal)
			ctx.translate(currentButton.x / scal, currentButton.y / scal)
			ctx.beginPath();
			ctx.moveTo(-35 + 5, -30);
			ctx.lineTo(+35 - 5, -45);
			ctx.lineTo(+35 - 5, -15);
			ctx.lineTo(-35 + 5, -0);
			ctx.closePath();
			ctx.fill();

			//

			ctx.roundRect(-35 + 5, -30, 10, 70, 1)
			ctx.fill();

			ctx.roundRect(+30 - 5, -45, 10, 70, 1)
			ctx.fill();

			//

			ctx.roundRect(-50 + 5, +22, 25, 25, 90)
			ctx.fill();

			ctx.roundRect(+15 - 5, +10, 25, 25, 90)
			ctx.fill();


			if (muted == true) {

				var siz = 30
				ctx.lineWidth = 15
				ctx.strokeStyle = "#FF7E64"
				ctx.beginPath();
				ctx.moveTo(-siz, -siz);
				ctx.lineTo(+siz, +siz);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(+siz, -siz);
				ctx.lineTo(-siz, +siz);
				ctx.closePath();
				ctx.stroke();

			}

			ctx.restore()


		}

		if (currentButton == fullScreenButton) {
			ctx.fillStyle = "#5D4E51";
			ctx.save()
			ctx.translate(currentButton.x, currentButton.y)
			var cic = 10
			ctx.roundRect(-45 + 5 + 5, -45 + 10 + 5 - 3 - 1, 30, cic, 180)
			ctx.fill()
			ctx.roundRect(-45 + 5 + 5, -45 + 10 + 5 - 3 - 1, cic, 30, 180)
			ctx.fill()
			//
			ctx.roundRect(20 - 10 - 5, -45 + 10 + 5 - 3 - 1, 30, cic, 180)
			ctx.fill()
			ctx.roundRect(40 - 10 - 5, -45 + 10 + 5 - 3 - 1, cic, 30, 180)
			ctx.fill()
			//
			ctx.roundRect(20 - 10 - 5, 40 - 10 - 5 - 1, 30, cic, 180)
			ctx.fill()
			ctx.roundRect(40 - 10 - 5, 20 - 10 - 5 - 1, cic, 30, 180)
			ctx.fill()
			//
			ctx.roundRect(-45 + 5 + 5, 40 - 10 - 5 - 1, 30, cic, 180)
			ctx.fill()
			ctx.roundRect(-45 + 5 + 5, 20 - 10 - 5 - 1, cic, 30, 180)
			ctx.fill()

			ctx.restore()

		}



		ctx.fillStyle = "#5D4E51";
		ctx.textAlign = "center";
		ctx.font = "bold " + currentButton.fSize + "px Tahoma";
		ctx.fillText(currentButton.text, currentButton.x + currentButton.xoff, currentButton.y + currentButton.yoff);

		ctx.globalAlpha = 1

	}
}

function drawCharacter(posx, posy, scale) {
	ctx.save()
	ctx.scale(scale, scale)
	ctx.translate(posx / scale, posy / scale)
	ctx.lineWidth = 10
	ctx.strokeStyle = "#5D4E51";
	ctx.fillStyle = "#5D4E51"
	ctx.roundRect(-30, 60, 100, 160, 180)
	ctx.fill()
	ctx.roundRect(-30 + 310, 60, 100, 160, 180)
	ctx.fill()
	//
	ctx.roundRect(40, 270, 100, 160, 180)
	ctx.fill()
	ctx.roundRect(210, 270, 100, 160, 180)
	ctx.fill()
	//
	ctx.strokeStyle = "#5D4E51";
	ctx.fillStyle = "#FFEA7E"
	ctx.roundRect(0, 0, 300 + 50, 400, 90)
	ctx.fill()
	ctx.stroke()
	ctx.fillStyle = "#FDF3BD"
	ctx.roundRect(30, 40, 240 + 50, 190, 45)
	ctx.fill()

	//
	//ctx.stroke()
	//
	ctx.fillStyle = "#fff"
	ctx.beginPath();
	ctx.ellipse(100, 130, 35, 55, 0, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = "#A09CF1"
	ctx.beginPath();
	ctx.ellipse(100, 120, 25, 45, 0, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = "#5D4E51"
	ctx.beginPath();
	ctx.ellipse(100, 95, 45, 25, 0.1, 0, 2 * Math.PI);
	ctx.fill();
	//
	ctx.fillStyle = "#fff"
	ctx.beginPath();
	ctx.ellipse(100 + 150, 130, 35, 55, 0, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = "#A09CF1"
	ctx.beginPath();
	ctx.ellipse(100 + 150, 120, 25, 45, 0, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = "#5D4E51"
	ctx.beginPath();
	ctx.ellipse(100 + 150, 95, 45, 25, -0.1, 0, 2 * Math.PI);
	ctx.fill();
	//
	if (animateMouth == true) {
		mouthCounter += mouthAddendum
		if (mouthCounter <= 0) {
			mouthAddendum = 5
		} else if (mouthCounter >= 35) {
			mouthAddendum = -5
		}
	} else {
		mouthCounter = 5
	}

	ctx.fillStyle = "#5D4E51"
	ctx.beginPath();
	ctx.ellipse(100 + 77, 180, 40, mouthCounter / 1.5, 0, 0, 2 * Math.PI);
	//ctx.arc(100+77, 160, 40, 0, 1 * Math.PI);
	ctx.stroke()
	ctx.fill();



	ctx.lineWidth = 20
	ctx.fillStyle = "#FF7E64"
	ctx.beginPath();
	ctx.ellipse(100 + 77, 6, 35, 30, 0, 1 * Math.PI, 0);
	//ctx.arc(100+77, 300, 40, 0, 1 * Math.PI);
	ctx.stroke()
	ctx.fill();



	//
	ctx.fillStyle = "#5D4E51"
	ctx.beginPath();
	ctx.ellipse(0, 290, 30, 30, 0, 0, 2 * Math.PI);
	//ctx.arc(100+77, 160, 40, 0, 1 * Math.PI);
	ctx.stroke()
	ctx.fill();

	ctx.fillStyle = "#5D4E51"
	ctx.beginPath();
	ctx.ellipse(350, 290, 30, 30, 0, 0, 2 * Math.PI);
	//ctx.arc(100+77, 160, 40, 0, 1 * Math.PI);
	ctx.stroke()
	ctx.fill();


	ctx.restore()
}

function drawShip(_xx, _yy, _scale, _angle) {
	//left
	var ww = 2
	var hh = 6

	//left
	ctx.save();
	ctx.translate(_xx * _scale, _yy * _scale)
	ctx.rotate(_angle)
	ctx.scale(_scale, _scale)

	ctx.beginPath();
	ctx.lineWidth = 20
	ctx.strokeStyle = "#5D4E51"
	ctx.fillStyle = "#5D4E51"
	var vertices = [{
		x: ww * blockSize + bSize + bSize / 2 + 10,
		y: hh * blockSize + bSize - 100
	}, {
		x: ww * blockSize + bSize + bSize / 2 + 10,
		y: hh * blockSize / 2 - 100
	}, {
		x: ww * blockSize + bSize + bSize / 2 + 100 + 10,
		y: hh * blockSize + bSize - 100
	}];
	roundedPoly(vertices, 5)
	ctx.stroke()
	ctx.fill()
	ctx.restore()

	//right
	ctx.save();
	ctx.translate(_xx * _scale, _yy * _scale)
	ctx.rotate(_angle)
	ctx.scale(_scale, _scale)

	ctx.beginPath();
	ctx.lineWidth = 20
	ctx.strokeStyle = "#5D4E51"
	ctx.fillStyle = "#5D4E51"
	var vertices = [{
		x: 0 + 10,
		y: hh * blockSize + bSize - 100
	}, {
		x: 0 + 10,
		y: hh * blockSize / 2 - 100
	}, {
		x: -100 + 10,
		y: hh * blockSize + bSize - 100
	}];
	roundedPoly(vertices, 5)
	ctx.stroke()
	ctx.fill()
	ctx.restore()


	ctx.save();
	ctx.translate(_xx * _scale, _yy * _scale)
	ctx.rotate(_angle)
	ctx.scale(_scale, _scale)

	ctx.beginPath();
	ctx.fillStyle = "#FF9E67"
	ctx.ellipse(60 + 60, 0 + 560, 40, 40, 0, 0, 2 * Math.PI);
	ctx.fill()
	ctx.beginPath();
	ctx.fillStyle = "#FEE66C"
	ctx.ellipse(60 + 60, 0 + 560, 25, 20, 0, 0, 2 * Math.PI);
	ctx.fill()
	ctx.restore()



	//bottom 1
	ctx.save();
	ctx.translate(_xx * _scale, _yy * _scale)
	ctx.rotate(_angle)
	ctx.scale(_scale, _scale)

	ctx.beginPath();
	ctx.lineWidth = 20
	ctx.strokeStyle = "#5D4E51"
	ctx.fillStyle = "#5D4E51"
	var vertices = [{
		x: 0 + 60,
		y: 0 + 550
	}, {
		x: 20 + 60,
		y: -50 + 550
	}, {
		x: 100 + 60,
		y: -50 + 550
	}, {
		x: 120 + 60,
		y: 0 + 550
	}];
	roundedPoly(vertices, 5)
	ctx.stroke()
	ctx.fill()
	ctx.restore()



	//center
	ctx.save();
	ctx.translate(_xx * _scale, _yy * _scale)
	ctx.rotate(_angle)
	ctx.scale(_scale, _scale)

	ctx.beginPath();
	ctx.lineWidth = 20
	ctx.strokeStyle = "#5D4E51"
	ctx.fillStyle = bagColor
	var vertices = [{
		x: 30,
		y: -80
	}, {
		x: (ww * blockSize) / 2 + bSize,
		y: -hh / 2 * blockSize - 80
	}, {
		x: ww * blockSize + bSize - 30 + bSize,
		y: -80
	}, {
		x: ww * blockSize + bSize + bSize,
		y: hh * blockSize
	}, {
		x: 0,
		y: hh * blockSize
	}];
	roundedPoly(vertices, 90)
	ctx.stroke()
	//ctx.fill()
	ctx.restore()

	ctx.save()
	ctx.clip()
	ctx.translate(_xx * _scale, _yy * _scale)
	ctx.rotate(_angle)
	ctx.scale(_scale, _scale)

	ctx.fillStyle = "#5D4E51"
	ctx.roundRect(0, -hh / 2 * blockSize - 80, w, hh / 2 * blockSize, 0)
	ctx.fill()

	ctx.restore()

	//center2
	ctx.save();
	ctx.translate(_xx * _scale, _yy * _scale)
	ctx.rotate(_angle)
	ctx.scale(_scale, _scale)

	ctx.beginPath();
	ctx.lineWidth = 20
	ctx.strokeStyle = "#5D4E51"
	ctx.fillStyle = bagColor
	var vertices = [{
		x: 30,
		y: -80
	}, {
		x: (ww * blockSize) / 2 + bSize,
		y: -hh / 2 * blockSize - 80
	}, {
		x: ww * blockSize + bSize - 30 + bSize,
		y: -80
	}, {
		x: ww * blockSize + bSize + bSize,
		y: hh * blockSize
	}, {
		x: 0,
		y: hh * blockSize
	}];
	roundedPoly(vertices, 90)
	ctx.stroke()
	//ctx.fill()
	ctx.restore()

	ctx.save()
	ctx.clip()

	ctx.translate(_xx * _scale, _yy * _scale)
	ctx.rotate(_angle)
	ctx.scale(_scale, _scale)

	ctx.fillStyle = "#5D4E51"
	ctx.roundRect(0, -hh / 2 * blockSize - 80, w, hh / 2 * blockSize, 0)
	ctx.fill()
	ctx.globalAlpha = 1
	ctx.restore()

}

function drawLogo(_xx, _yy, _scale) {
	ctx.save()
	ctx.translate(_xx, _yy)
	ctx.scale(_scale, _scale)
	//draw texts
	ctx.fillStyle = "#5D4E51";

	//DRAW TITLE
	var xx = 0 - mouseX / 100
	var yy = 0 - mouseY / 100
	var newX = xx + w / 2
	if (state == "title") newY = yy + h * 0.4
	else if (state == "menu") newY = yy + h * 0.24
	else if (state == "game" || state == "story-intro" || state == "story-middle" || state == "story-ending") newY = -1000
	else if (state == "menu-transitioning") newY = -1000
	else if (state == "game-transitioning") newY = -1000
	else if (state == "title-transitioning") newY = yy + h * 0.4

	titlePos.x = lerp(titlePos.x, newX, lerpSpeed)
	titlePos.y = lerp(titlePos.y, newY, lerpSpeed)

	ctx.font = "bold 170px Tahoma";

	ctx.textAlign = "center";
	ctx.save()
	ctx.fillText("PACKA", titlePos.x, titlePos.y);
	ctx.restore()
	ctx.save()
	ctx.font = "bold 118px Tahoma";
	ctx.fillText("BUNCHAS", titlePos.x + 5, titlePos.y + 120);
	ctx.restore()

	ctx.save()

	ctx.fillStyle = "#fff"


	ctx.rect(0, titlePos.y - 540, w, 400)
	ctx.rect(0, titlePos.y + 140, w, 400)
	ctx.rect(titlePos.x - 500, 0, 205, h)
	ctx.rect(titlePos.x + 310, 0, 200, h)
	ctx.save()
	ctx.translate(titlePos.x + 530, titlePos.y - 540)
	ctx.rotate(1.2, 1.2)
	ctx.rect(0, 0, w, 400)
	ctx.restore()
	//ctx.fill()
	//drawCharacter(titlePos.x-165, titlePos.y+200, 1, 45)
	ctx.clip()
	drawShip(titlePos.x + 70, titlePos.y - 200, 1, 45)


	//ctx.clip()
	ctx.restore()
	ctx.restore()
}


function drawTexts() {

	drawLogo(0, 0, 1)

	//DRAW MESSAGE

	var xx = 0 - mouseX / 80
	var yy = 0 - mouseY / 80

	var newX2 = xx + 45
	var newY2 = yy + h + 200
	if (state == "title") newY2 = yy + h * 0.92 //newY2 = yy + h * 0.6
	else if (state == "menu" || state == "story-intro" || state == "story-middle" || state == "story-ending") newY2 = yy + h * 0.92
	else if (state == "game") newY2 = yy + h * 0.92
	else if (state == "game-transitioning") newY2 = yy + h + 200
	else if (state == "menu-transitioning") newY2 = yy + h + 200
	else if (state == "title-transitioning") newY2 = yy + h + 200

	if (bottomTextText == "") {
		newY2 = yy + h + 200
	}

	helpCharPos.x = lerp(helpCharPos.x, newX2, lerpSpeed)
	helpCharPos.y = lerp(helpCharPos.y, newY2, lerpSpeed)

	ctx.globalAlpha = 0.5
	ctx.fillStyle = "#fff"
	ctx.roundRect(helpCharPos.x, helpCharPos.y - 80, w - 80, 200, 90)
	ctx.fill()
	ctx.globalAlpha = 1
	ctx.strokeStyle = "#5D4E51";
	ctx.lineWidth = 10
	ctx.stroke()

	ctx.save()
	ctx.clip()
	drawCharacter(helpCharPos.x + 70, helpCharPos.y - 40, 0.65)
	ctx.restore()

	ctx.roundRect(helpCharPos.x, helpCharPos.y - 80, w - 80, 200, 90)
	ctx.strokeStyle = "#5D4E51";
	ctx.lineWidth = 10
	ctx.stroke()


	//draw text
	var newX = xx + 280
	var newY = yy + h + 200
	if (state == "title") newY = yy + h * 0.92 //newY = yy + h * 0.6
	else if (state == "menu" || state == "story-intro" || state == "story-middle" || state == "story-ending") newY = yy + h * 0.92
	else if (state == "game") newY = yy + h * 0.92
	else if (state == "game-transitioning") newY = yy + h + 200
	else if (state == "menu-transitioning") newY = yy + h + 200
	else if (state == "title-transitioning") newY = yy + h + 200

	if (bottomTextText == "") {
		newY = yy + h + 200
	}

	textPos.x = lerp(textPos.x, newX, lerpSpeed)
	textPos.y = lerp(textPos.y, newY, lerpSpeed)


	ctx.fillStyle = "#5D4E51";
	ctx.font = "bold 50px Tahoma";
	ctx.textAlign = "left";
	ctx.fillText(bottomTextText, textPos.x + 120, textPos.y + 45);

	//DRAW STORY TEXT
	//draw text
	var newX = xx + w / 2 - 400
	var newY = yy + 400

	storyTextPos.x = lerp(storyTextPos.x, newX, lerpSpeed)
	storyTextPos.y = lerp(storyTextPos.y, newY, lerpSpeed)


	if (state == "story-intro" || state == "story-middle" || state == "story-ending") {
		ctx.globalAlpha = 0.5
		ctx.fillStyle = "#fff"
		ctx.roundRect(storyTextPos.x - 40, storyTextPos.y - 80, 900, 700, 45)
		ctx.fill()

		ctx.beginPath();
		var vertices = [{
			x: storyTextPos.x + 200 + 150,
			y: storyTextPos.y + 600 + 20
		}, {
			x: storyTextPos.x + 200 + 150 + 100,
			y: storyTextPos.y + 600 + 20
		}, {
			x: storyTextPos.x + 150 + 150,
			y: storyTextPos.y + 600 + 20 + 100
		}]
		roundedPoly(vertices, 0)
		ctx.fill()

		ctx.globalAlpha = 1

		drawCharacter(storyTextPos.x, storyTextPos.y + 800, 1)
	}


	ctx.fillStyle = "#5D4E51";
	ctx.font = "bold 50px Tahoma";
	ctx.textAlign = "left";
	for (var ttt = 0; ttt <= storyMessage.message.length - 1; ttt++) {
		ctx.save()
		ctx.fillText(storyMessage.message[ttt], storyTextPos.x, storyTextPos.y + ttt * 65);
		ctx.restore()
	}


	//DRAW MODE TEXT
	var newX = xx + w / 2
	var newY = 3000

	if (state == "title") newY = 3000
	else if (state == "menu") newY = yy + h * 0.57
	else if (state == "game" || state == "story-intro" || state == "story-middle" || state == "story-ending") newY = 3000
	else if (state == "menu-transitioning") newY = 3000
	else if (state == "game-transitioning") newY = 3000
	else if (state == "title-transitioning") newY = 3000

	menuTextPos.x = lerp(menuTextPos.x, newX, lerpSpeed)
	menuTextPos.y = lerp(menuTextPos.y, newY, lerpSpeed)

	ctx.font = "bold 100px Tahoma";
	ctx.textAlign = "center";
	ctx.fillText(menuText, menuTextPos.x, menuTextPos.y);

	//DRAW MODE TEXT
	var newX = xx + w / 2
	var newY = -1500

	if (state == "title") newY = -1500
	else if (state == "menu") newY = yy + h * 0.48
	else if (state == "game" || state == "story-intro" || state == "story-middle" || state == "story-ending") newY = -1500
	else if (state == "menu-transitioning") newY = -1500
	else if (state == "game-transitioning") newY = -1500
	else if (state == "title-transitioning") newY = -1500

	modeTextPos.x = lerp(modeTextPos.x, newX, lerpSpeed)
	modeTextPos.y = lerp(modeTextPos.y, newY, lerpSpeed)

	ctx.font = "bold 60px Tahoma";
	ctx.textAlign = "center";
	ctx.fillText("Game Mode:", modeTextPos.x, modeTextPos.y);

	//DRAW SCORE
	var newX = xx + w / 2
	var newY = 2500
	var dText = "Blockychums left: "
	ctx.font = "bold 40px Tahoma";



	if (state == "title") newY = 2500
	else if (state == "menu") {
		ctx.globalAlpha = 0.7
		newY = yy + h * 0.65
	} else if (state == "game") {
		ctx.globalAlpha = 1
		newY = yy + h * 0.06
		dText = ""
		ctx.font = "bold 60px Tahoma";
	} else if (state == "menu-transitioning") {
		newY = -1500
		dText = ""
		ctx.font = "bold 60px Tahoma";
	} else if (state == "title-transitioning") newY = 2500

	pTextPos.x = lerp(pTextPos.x, newX, lerpSpeed)
	pTextPos.y = lerp(pTextPos.y, newY, lerpSpeed)



	ctx.textAlign = "center";
	ctx.fillText(dText + currFormat(currentPolyTextToShow), pTextPos.x, pTextPos.y);
	ctx.globalAlpha = 1


}

function drawStar(x, y, _scale, _angle) {
	ctx.save()
	ctx.translate(x, y)
	ctx.scale(_scale, _scale)
	ctx.fillStyle = '#fff';
	ctx.beginPath();
	ctx.arc(0, 0, 15 * _scale, 0, 2 * Math.PI);
	ctx.fill();
	ctx.restore()
}


function drawBackGround() {


	//DRAW BACKGROUND
	ctx.globalAlpha = 1
	ctx.fillStyle = bgColor
	var borderSize = 20
	ctx.roundRect(borderSize / 2, borderSize / 2, w - borderSize, h - borderSize, 45)
	ctx.lineWidth = 20
	ctx.fill()
	ctx.globalAlpha = 1



	var newX = 0 - mouseX / 10
	var newY = 0 - mouseY / 10

	var xxx = lerp(bgPos.x, newX, lerpSpeed)
	var yyy = lerp(bgPos.y, newY, lerpSpeed)

	ctx.beginPath();
	ctx.fillStyle = planetColor
	ctx.arc(w / 2 + xxx, h * 0.95 + yyy, 1000, 0, 2 * Math.PI);
	ctx.fill();
	if (planetCraters == true) {

		ctx.save()
		ctx.clip()
		ctx.globalAlpha = 0.03
		ctx.fillStyle = "#000"
		ctx.beginPath();
		ctx.ellipse(150, 800, 400, 400, 0, 0, 2 * Math.PI);
		ctx.fill();
		//
		ctx.beginPath();
		ctx.ellipse(1050, 1250, 400, 400, 0, 0, 2 * Math.PI);
		ctx.fill();
		//
		ctx.beginPath();
		ctx.ellipse(250, 1750, 400, 400, 0, 0, 2 * Math.PI);
		ctx.fill();
		ctx.globalAlpha = 1
		ctx.restore()


	} else {
		ctx.save()
		ctx.clip()
		ctx.globalAlpha = 0.05
		ctx.fillStyle = "#000"
		ctx.beginPath();
		ctx.lineWidth = 150
		ctx.ellipse(w / 2 + xxx, h / 2 - 50 + yyy, 400, 200, 0, 0, 2 * Math.PI);
		ctx.stroke()
		ctx.beginPath();
		ctx.ellipse(w / 2 + xxx, h / 2 + yyy, 700, 500, 0, 0, 2 * Math.PI);
		ctx.stroke()
		ctx.beginPath();
		ctx.ellipse(w / 2 + xxx, h / 2 + 50 + yyy, 1000, 800, 0, 0, 2 * Math.PI);
		ctx.stroke()
		ctx.globalAlpha = 1
		ctx.restore()
	}

	//sun
	var newX = 0 - mouseX / 20
	var newY = 0 - mouseY / 20

	var xxx = lerp(bgPos.x, newX, lerpSpeed)
	var yyy = lerp(bgPos.y, newY, lerpSpeed)

	ctx.fillStyle = sunColor
	ctx.beginPath();
	ctx.arc(800 + xxx, 300 + yyy, 150, 0, 2 * Math.PI);
	ctx.fill();



	if (sunCraters == true) {
		ctx.globalAlpha = 0.05
		ctx.fillStyle = "#000"
		ctx.beginPath();
		ctx.arc(850 + xxx, 400 + yyy, 10, 0, 2 * Math.PI);
		ctx.fill();
		//
		ctx.beginPath();
		ctx.arc(900 + xxx, 350 + yyy, 20, 0, 2 * Math.PI);
		ctx.fill();
		ctx.globalAlpha = 1
	} else {
		ctx.save()
		ctx.clip()
		ctx.globalAlpha = 0.05
		ctx.fillStyle = "#000"
		ctx.roundRect(800 + xxx, 250 + 80 + yyy, 1000, 40, 180)
		ctx.fill();
		ctx.roundRect(850 + xxx, 200 + 80 + yyy, 1000, 40, 180)
		ctx.fill();
		ctx.roundRect(870 + xxx, 300 + 80 + yyy, 1000, 40, 180)
		ctx.fill();
		ctx.restore()
	}
	if (halfSun == true) {
		ctx.fillStyle = bgColor
		ctx.beginPath();
		ctx.arc(650 + xxx, 200 + yyy, 150, 0, 2 * Math.PI);
		ctx.fill();
	}

	var newX = 0 - mouseX / 30
	var newY = 0 - mouseY / 30

	var xxx = lerp(bgPos.x, newX, lerpSpeed)
	var yyy = lerp(bgPos.y, newY, lerpSpeed)


	ctx.fillStyle = smallPlanetColor
	ctx.beginPath();
	ctx.arc(300 + xxx, 500 + yyy, 70, 0, 2 * Math.PI);
	ctx.fill();
	if (smallPlanet == true) {
		//
		ctx.globalAlpha = 0.05
		ctx.fillStyle = "#000"
		ctx.beginPath();
		//ctx.arc(300, 1150, 200, 0, 2 * Math.PI);
		ctx.ellipse(300 + xxx, 500 + yyy, 110, 35, 0, 0, 2 * Math.PI);
		ctx.fill();
		ctx.globalAlpha = 1
		//
		ctx.beginPath();
		ctx.fillStyle = smallPlanetColor
		ctx.ellipse(300 + xxx, 480 + yyy, 67, 25, 0, 0, 2 * Math.PI);
		ctx.fill();
		//
	} else {
		ctx.strokeStyle = "#000"
		ctx.globalAlpha = 0.03
		ctx.beginPath();
		ctx.arc(300 + xxx, 500 + yyy, 100, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.globalAlpha = 1
	}

	drawStar(200, 200, 0.8, 45)
	drawStar(420, 400, 0.4, 0)
	drawStar(120, 350, 0.5, 0)
	drawStar(200, 600, 0.5, 0)
	drawStar(500, 650, 0.6, 45)
	drawStar(550, 250, 0.5, 0)
	drawStar(800, 600, 0.8, 45)
	drawStar(950, 800, 0.5, 45)
	drawStar(100, 800, 0.7, 45)
	drawStar(400, 60, 0.4, 0)
	drawStar(700, 100, 0.6, 0)


	//Draw grid

	/*
	ctx.strokeStyle = "#5D4E51";
	for (let k = 0; k <= w / blockSize; k++) {
		for (let i = 0; i <= h / blockSize; i++) {
			ctx.lineWidth = 15
			ctx.beginPath();
			ctx.globalAlpha = 0.01
			ctx.moveTo(-bSize + i * blockSize + bgPos.x+gridOffsetX, 0);
			ctx.lineTo(-bSize + i * blockSize + bgPos.x+gridOffsetX, w * 2);
			ctx.stroke();
			ctx.globalAlpha = 1
			ctx.closePath();
		}
	}
	for (let k = 0; k <= w / blockSize; k++) {
		for (let i = 0; i <= h / blockSize; i++) {

			ctx.lineWidth = 15
			ctx.beginPath();
			ctx.globalAlpha = 0.01
			ctx.moveTo(0, -bSize + i * blockSize + bgPos.y);
			ctx.lineTo(h, -bSize + i * blockSize + bgPos.y);
			ctx.stroke();
			ctx.globalAlpha = 1
			ctx.closePath();

		}
	}
	*/



}

function drawOverlay() {
	//overlay
	var borderSize = 20
	ctx.roundRect(borderSize / 2, borderSize / 2, w - borderSize, h - borderSize, 45)
	if (showLoading == true) {
		overlayAlpha += 0.05
	} else {
		if (overlayAlpha > 0) {
			overlayAlpha -= 0.05
		}
	}
	if (overlayAlpha < 0) {
		overlayAlpha = 0
	}
	ctx.globalAlpha = overlayAlpha
	ctx.fillStyle = loadingColor
	ctx.fill()
	//LOADING TEXT
	ctx.globalAlpha = overlayAlpha
	ctx.font = "bold 100px Tahoma";
	ctx.fillStyle = "#5D4E51";
	ctx.textAlign = "center";
	ctx.fillText("Loading...", w / 2, h / 2 + 100);
	//
	ctx.globalAlpha = overlayAlpha / 40
	ctx.fillStyle = "#000"

	for (var ff = 0; ff <= 12; ff++) {
		ctx.roundRect(-300, 160 * ff, 2000, 80, 180)
		ctx.fill();
	}

	ctx.globalAlpha = 1
}


function draw() {
	//clear rect
	ctx.clearRect(0, 0, w, h);



	drawBackGround()

	if (gameStarted == true && state == "game") {
		drawPieces()
	}



	

	//draw buttons
	if (state != "title") drawButtons()

	drawTexts()


	//DRAW FPS
	/*
		var thisLoop = new Date();
		var fps = 1000 / (thisLoop - lastLoop);
		lastLoop = thisLoop;

		ctx.font = "bold 30px Tahoma";
		ctx.fillStyle = "#5D4E51";
		ctx.textAlign = "center";
		ctx.fillText(Math.floor(fps), 60, 50);
	*/

	//DRAW VERSION NUMBER
	/*
	ctx.font = "bold 30px Tahoma";
	ctx.fillStyle = "#5D4E51";
	ctx.textAlign = "center";
	ctx.fillText(versionN, w - 60, 50);
	*/



	drawOverlay()

	//DRAW BORDER
	ctx.strokeStyle = "#5D4E51"
	var borderSize = 20
	ctx.roundRect(borderSize / 2, borderSize / 2, w - borderSize, h - borderSize, 45)
	ctx.lineWidth = 20
	ctx.stroke()

}


/*
===============================================    GAME FUNCTIONS   ===============================================
*/


function story22() {
	setStoryMessage(["More precisely 13.312", "but that isn't a problem", "for the PACKABUNCHAS!", " ",
		"We are not in a hurry", "after all, and you know", "what they say:",
		"puzzles keep our brain young", "and agile!"
	])



	//setMessage(["Click to continue"], true)
	//
	skipState = 2
	animateMouth = true
	storyTimeOut = setTimeout(function() {
		animateMouth = false
		skipState = 3
	}, 9500)
}

function story32() {
	setStoryMessage(["Oh, the dev left a note, too:", " ", "Did you really finish", "PACKABUNCHAS?", " ",
		"CONGRATULATIONS!", " ", "and many", "THANKS FOR PLAYING!!!", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "      - click to reset the game! - "
	])

	//setMessage(["Click to continue"], true)
	//
	skipState = 2
	animateMouth = true
	storyTimeOut = setTimeout(function() {
		animateMouth = false
		storyTimeOut = setTimeout(function() {
			skipState = 3
		}, 3000)
	}, 7000)

}


function story12() {
	setStoryMessage(["And you know them,", "they love so much staying", "close together that the", "only way to rescue them",
		"is to have them packed", "perfectly in tiny little", "shuttles.", " ", "Easier said than done!"
	])



	//setMessage(["Click to continue"], true)
	//
	skipState = 2
	animateMouth = true
	storyTimeOut = setTimeout(function() {
		skipState = 3
		animateMouth = false
	}, 10000)
}

function story13() {
	setStoryMessage(["OKAY, let's roll up", "our sleeves and get", "those Blockychums back!", " ", "Remember:", "any game mode is fine,", "as long as you feel comfortable.", " ", "PACKABUNCHAS!"])



	//setMessage(["Click to continue"], true)
	skipState = 4
	animateMouth = true
	storyTimeOut = setTimeout(function() {
		skipState = 5
		animateMouth = false
	}, 8500)
}


function goToGame() {
	if (state == "menu") {

		leftButton.originalx = -500
		//leftButton.x = -500
		rightButton.originalx = w + 500
		//rightButton.x = w + 500
		startButton.originaly = 10000
		//startButton.y = h + 500

		//backButton.x = -500
		fullScreenButton.originalx = -1500


		endCinematicState = 2
		showLoading = true
		setLoadingColor()
		state = "game-transitioning"
		setMessage([""])

		setTimeout(function() {
			backButton.originalx = w * 0.1
			createLevel()
			state = "game"
		}, 500)

	}


}



function backToMenu() {
	if (state == "game" && gameStarted == true && isCinematic == false) {

		if (helpTimeout) clearTimeout(helpTimeout)

		state = "menu-transitioning"

		//toDrawPieces = true
		draggedBlock = null
		lastDraggedBlock = null
		gameStarted = false
		pieces = []
		bag = {}

		backButton.originalx = -500

		showLoading = true
		setLoadingColor()

		setBgColors()
		setTimeout(function() {
			showLoading = false
			state = "menu"
			leftButton.originalx = w * 0.15
			//leftButton.x = -500
			rightButton.originalx = w * 0.85
			//rightButton.x = w + 500
			startButton.originaly = h * 0.75
			//startButton.y = h + 500


			//backButton.x = -500
			fullScreenButton.originalx = w * 0.11

			pTextPos.y = 3000 //to avoid cross positioning

			setMessage(["Pick a game mode!"], true)
		}, 500)



	}

}



function changeMode(_val) {
	if (state == "menu") {
		currentGameMode += _val
		if (currentGameMode < 0) currentGameMode = gameModes.length - 1
		if (currentGameMode > gameModes.length - 1) currentGameMode = 0
		menuText = gameModes[currentGameMode]
		saveData("currentGameMode", currentGameMode.toString())
	}
}



function createPolyomino(_n, _length, _mixed) {
	var colors = ["#FFEA7E", "#A09CF1", "#C2FDFF", "#FFC886", "#94DEC3", "#D8D0FF", "#FED1E6", "#7DC864", "#FF7E64", "#FDF3BD"] //,"#DD558E"
	var colorList = [...colors]
	shuffleArray(colorList)


	for (let i = 0; i < _n; i++) {
		let size = _length
		if (_mixed == true) {
			//min duomino
			size = Math.floor(Math.random() * _length) + 1
			if (size == 1) {
				size = 2
			}
		}
		createPiece(150 + 250 * i, 200, generatePolyomino(size), colorList[0])


		colorList.shift()
		if (colorList.length == 0) {
			colorList = [...colors]
			shuffleArray(colorList)
		}
	}

}


function createButton(_x, _y, _h, _w, _text, _fontSize, _fontOffsetX, _fontOffsetY, _clickFunction) {
	let button = {
		x: _x,
		y: _y,
		originalx: _x,
		originaly: _y,
		w: _w,
		h: _h,
		text: _text,
		fSize: _fontSize,
		xoff: _fontOffsetX,
		yoff: _fontOffsetY,
		onClick: _clickFunction,
		contains: function(xx, yy) {
			if (xx >= this.x - this.w / 2 && xx <= this.x + this.w / 2 && yy >= this.y - this.h / 2 && yy <= this.y + this.h / 2) {
				return true
			}
			return false
		},
	}
	return button
}


function generatePolyomino(_blocks) {
	var alphaModifier = 0
	var alphaModifier2 = 0.1
	var blocks = [
		[0, 0, alphaModifier2]
	]
	var minX = 0
	var maxX = 0
	var minY = 0
	var maxY = 0

	for (let i = 0; i < _blocks - 1; i++) {
		var toCreate = true
		while (toCreate == true) {
			//take random block
			var refBlock = blocks[Math.floor(Math.random() * blocks.length)]
			//clone
			var newBlock = [refBlock[0], refBlock[1]]
			//
			if (refBlock[2] == alphaModifier2) {
				newBlock[2] = alphaModifier
			} else {
				newBlock[2] = alphaModifier2
			}

			//change x OR y (0 or 1)
			var toShift = Math.round(Math.random())
			//add or remove 1
			newBlock[toShift] += Math.random() < 0.5 ? -1 : 1
			//checks if already exists
			var found = false
			for (let j = 0; j < blocks.length; j++) {
				if (newBlock[0] == blocks[j][0] && newBlock[1] == blocks[j][1]) {
					toCreate = true
					found = true
					break
				}
			}
			//repeat if found already existing
			toCreate = found
		}
		blocks.push(newBlock)
	}
	return blocks
}

function createPiece(_xx, _yy, _blocks, _fillColor) {
	var piece = {
		name: "",
		originalPosition: {
			x: _xx,
			y: _yy
		},
		position: {
			x: _xx,
			y: _yy
		},
		blocks: _blocks,
		color: "#ffffff",
		angle: 0,
		originalColor: "#ffffff",
		pickColor: "#ffffff",
		fillColor: _fillColor,
		isDragged: false,
		eyeBlock: 0,
		type: "",
		contains: function(xx, yy) {
			for (let i = 0; i < this.blocks.length; i++) {
				var currentBlock = this.blocks[i]
				var currentBlockX = this.originalPosition.x + currentBlock[0] * blockSize
				var currentBlockY = this.originalPosition.y + currentBlock[1] * blockSize

				if (xx >= currentBlockX - bSize && xx <= currentBlockX + bSize && yy >= currentBlockY - bSize && yy <= currentBlockY + bSize) {
					return true
				}
			}
			return false
		},
		containsCurrentPosition: function(xx, yy) {
			for (let i = 0; i < this.blocks.length; i++) {
				var currentBlock = this.blocks[i]
				var currentBlockX = this.position.x + currentBlock[0] * blockSize
				var currentBlockY = this.position.y + currentBlock[1] * blockSize

				if (xx >= currentBlockX - bSize && xx <= currentBlockX + bSize && yy >= currentBlockY - bSize && yy <= currentBlockY + bSize) {
					return true
				}
			}
			return false
		},
		rotate: function() {
			for (let i = 0; i < this.blocks.length; i++) {
				var currentBlock = this.blocks[i]

				var newX = -currentBlock[1]
				var newY = currentBlock[0]
				currentBlock[0] = newX + 1 - 1
				currentBlock[1] = newY //should be -1 but +1 is added to rotate around piece center
			}
			this.angle += 90
			if (this.angle == 360) {
				this.angle = 0
			}

		},
		rotateTo: function(_angle) {
			//rotate to 0
			while (this.angle != 0) {
				this.rotate()
			}
			//rotate to specific angle
			var aTo = _angle / 90
			for (let i = 0; i < aTo; i++) {
				this.rotate()
			}
		},
		center: function() {

			this.rotateTo(0)

			var minX = 0
			var maxX = 0
			var minY = 0
			var maxY = 0

			for (let i = 0; i < this.blocks.length; i++) {
				currentBlock = this.blocks[i]
				minX = Math.min(minX, currentBlock[0])
				maxX = Math.max(maxX, currentBlock[0])
				minY = Math.min(minY, currentBlock[1])
				maxY = Math.max(maxY, currentBlock[1])
			}

			var ww2 = Math.floor((maxX - minX) + 1)
			var hh2 = Math.floor((maxY - minY) + 1)


			var centerX = Math.floor(minX + ww2 / 2)
			var centerY = Math.floor(minY + hh2 / 2)

			for (let qq = 0; qq < this.blocks.length; qq++) {
				this.blocks[qq][0] = this.blocks[qq][0] - centerX
				this.blocks[qq][1] = this.blocks[qq][1] - centerY
			}
		}
	}

	piece.eyeBlock = Math.floor(Math.random() * piece.blocks.length)
	//piece.name = makeid(5)
	piece.name = pieces.length + "n"

	var types = ["regular", "striped", "pois"]
	piece.type = types[Math.floor(Math.random() * types.length)]


	piece.center()

	pieces.push(piece)

	//return piece
}

function generateBag(_blocks) {

	//generate bag using first piece as base 
	//( to be sure at least first piece fits)
	var area = _blocks - pieces[0].blocks.length
	var blocks = []
	for (let j = 0; j < pieces[0].blocks.length; j++) {
		var bl = [pieces[0].blocks[j][0], pieces[0].blocks[j][1]]
		blocks.push(bl)
	}



	var minX = 0
	var maxX = 0
	var minY = 0
	var maxY = 0

	for (let i = 0; i < area; i++) {
		var toCreate = true
		while (toCreate == true) {
			//take random block
			var refBlock = blocks[Math.floor(Math.random() * blocks.length)]
			//clone
			var newBlock = [refBlock[0], refBlock[1]]
			//change x OR y (0 or 1)
			var toShift = Math.round(Math.random())
			//add or remove 1
			newBlock[toShift] += Math.random() < 0.5 ? -1 : 1
			//checks if already exists
			var found = false
			for (let j = 0; j < blocks.length; j++) {
				if (newBlock[0] == blocks[j][0] && newBlock[1] == blocks[j][1]) {
					toCreate = true
					found = true
					break
				}
			}
			//repeat if found already existing
			toCreate = found
		}


		blocks.push(newBlock)
	}

	return blocks
}


function createBag(_area, _margin) {

	//regular blocks
	//var BBB = generatePolyomino(_area + _margin)
	var BBB = generateBag(_area + _margin)


	bag = {
		originalPosition: {
			x: w / 2,
			y: h / 2
		},
		position: {
			x: w / 2,
			y: h / 2
		},
		blocks: BBB,
		contains: function(xx, yy) {
			for (let i = 0; i < this.blocks.length; i++) {
				var currentBlock = this.blocks[i]
				var currentBlockX = this.originalPosition.x + currentBlock[0] * blockSize
				var currentBlockY = this.originalPosition.y + currentBlock[1] * blockSize

				if (xx >= currentBlockX - bSize && xx <= currentBlockX + bSize && yy >= currentBlockY - bSize && yy <= currentBlockY + bSize) {
					return true
				}
			}
			return false
		}
	}
}



function checkSolutionWithCurrentObjOder(_conf) {
	//check solution with _conf array of objects

	//move all pieces away
	pieces.find(currentPiece => {
		currentPiece.originalPosition.x = -1000
		currentPiece.originalPosition.y = -1000
	})

	//check this current configuration of piece order
	var isThereSolution = false
	//for every piece
	for (let kk = 0; kk < _conf.length; kk++) {
		let positionFound = false
		//for every cell y and x
		//contained in bag
		//since first block of piece must be in bag itself
		for (let bb = 0; bb < bag.blocks.length; bb++) {
			//take the position of piece
			_conf[kk].originalPosition.x = bag.blocks[bb][0] * blockSize + bag.originalPosition.x
			_conf[kk].originalPosition.y = bag.blocks[bb][1] * blockSize + bag.originalPosition.y
			//checks if piece fits (is completely inside bag) and if it does not collide with others
			if (checkIfPieceFits(bag, _conf[kk]) && collideWithOtherPieces(_conf[kk], _conf) == false) {
				//breaks, stays there, position found!
				positionFound = true
				isThereSolution = true
				break //and go to next piece
			}
		}
		//if after all y and x checks still no position is found, the piece cannot be placed
		//in this situation.
		if (positionFound == false) {
			isThereSolution = false
			return isThereSolution
		}
	}
	return isThereSolution
}


function checkSolutionNoRotation() {
	//check all pieces with their current angle

	//generate all possible array orders
	let allConfigurations = permute(pieces)


	let confFound = false
	for (let g = 0; g < allConfigurations.length; g++) {
		//check solution with each configuration/array order
		if (checkSolutionWithCurrentObjOder(allConfigurations[g]) == true) {
			confFound = true
			break
		}
	}

	return confFound
}


function checkSolutionWithRotations() {
	//Create an array of possible rotations for each object
	//generate array based on number of objects
	let arr2d = []
	for (let n = 0; n < pieces.length; n++) {
		arr2d.push([0, 90, 180, 270])
	}

	let allConfigurations = allCombinationsOfArray(arr2d)



	let confFound = false
	//for every rotation configuration
	for (let g = 0; g < allConfigurations.length; g++) {

		//rotate pieces to that configuration
		for (let kk = 0; kk < pieces.length; kk++) {
			pieces[kk].rotateTo(allConfigurations[g][kk])
		}
		//and check all solutions with no rotation for this rotation configuration
		if (checkSolutionNoRotation() == true) {
			confFound = true
			break
		} else {
			confFound = false
		}
	}

	if (confFound == false) {
		return false
	}
	return true
}


function centerBag() {
	var minX = 0
	var maxX = 0
	var minY = 0
	var maxY = 0

	for (let i = 0; i < bag.blocks.length; i++) {
		currentBlock = bag.blocks[i]
		minX = Math.min(minX, currentBlock[0])
		maxX = Math.max(maxX, currentBlock[0])
		minY = Math.min(minY, currentBlock[1])
		maxY = Math.max(maxY, currentBlock[1])
	}

	var ww2 = (maxX - minX) + 1
	var hh2 = (maxY - minY) + 1


	var centerX = minX + ww2 / 2
	var centerY = minY + hh2 / 2

	for (let i = 0; i < bag.blocks.length; i++) {
		bag.blocks[i][0] = bag.blocks[i][0] - minX - Math.floor(ww2 / 2)
		bag.blocks[i][1] = bag.blocks[i][1] - minY - Math.floor(hh2 / 2)
	}

	//X
	bag.originalPosition.x = w / 2


	//Y
	bag.originalPosition.y = h - hh2 / 2 * blockSize - 4 * blockSize
	//if height is odd
	if (Math.abs(hh2 % 2) == 1) {
		bag.originalPosition.y -= blockSize
	}

	if (Math.abs(ww2 % 2) == 1) {
		gridOffsetX = -bSize
	} else {
		gridOffsetX = 0
	}

	//align
	bag.originalPosition.x = Math.floor(Math.round(bag.originalPosition.x / blockSize) * blockSize) + gridOffsetX
	bag.originalPosition.y = Math.floor(Math.round(bag.originalPosition.y / blockSize) * blockSize)

	bag.position.x = bag.originalPosition.x
	bag.position.y = bag.originalPosition.y
}

function generateLevel(_numberOfPolyominos, _numberOfPolyominoBlocks, _margin, _mixed) {
	GENERATING = true

	pieces = []
	createPolyomino(_numberOfPolyominos, _numberOfPolyominoBlocks, _mixed)

	bag = {}
	createBag(_numberOfPolyominos * _numberOfPolyominoBlocks, _margin)
	centerBag()


	var isSolution = checkSolutionWithRotations()
	if (isSolution == false) {

		//get time since starting generating
		endTime2 = new Date();
		var timeDiff2 = endTime2 - startTime2;
		var seconds2 = Math.round(timeDiff2);


		var MSECONDS_TO_ADD_MARGIN = 100
		if (seconds2 < MSECONDS_TO_ADD_MARGIN) {
			generateLevel(_numberOfPolyominos, _numberOfPolyominoBlocks, _margin)
		} else {
			//if too much time is passed
			//add an additional block to bag, to simplify solution
			//add margin
			generateLevel(_numberOfPolyominos, _numberOfPolyominoBlocks, _margin + 1)

			//or just quit?
			//gameStarted = true
			//GENERATING = false
		}
	} else {

		//Solution has been found

		endTime2 = new Date();
		var timeDiff2 = endTime2 - startTime2; //in ms
		// strip the ms
		//timeDiff /= 1000;

		// get seconds 
		var seconds2 = Math.round(timeDiff2);

		//Start playing level

		removeUnusedBagSpaces()
		//saveSolution()
		centerBag()
		scramblePieces()
		bag.position.y = 10000


		helpTimeout = setTimeout(function() {
			if (showTutorial == true) {
				sendTutorialMessages()
			} else {
				sendRandomMessage()
			}
		}, 1000)



		gameStarted = true
		toDrawPieces = true
		GENERATING = false

	}

}

function sendTutorialMessages() {
	setMessage(["Put them into the ship!", "Drag and drop them in!", "Double click to rotate!"], false)
	message.timeToDisappear = 5000 //for tutorial, last phrase stays longer, to tell you how to rotate!
	if (helpTimeout) clearTimeout(helpTimeout)
	helpTimeout = setTimeout(sendTutorialMessages, 20000) //and tutorial messages are showed sooner
}

function sendRandomMessage() {
	setMessage([""])
	if (helpTimeout) clearTimeout(helpTimeout)

	var randomMessages = ["Put them into the ship!", "Drag and drop them in!", "Double click to rotate!", "This is a fun one!", "PACKABUNCHAS!",
		"...", "That's a lovely planet.", "Look at the stars!", "The universe is SO big!", "<3", "#js13k", "lol", "^__^",
		"I love yellow!", "*stretches*", "Stay hydrated, bro!", "Posture check!", "Are you hungry, too?",
		"Nice move!", "10/10", "I love my job.", "What a beautiful day!", "UH-OH!", "♪┗ ( ･o･) ┓♪", "Hi!",
		"Way to go, Spacey!", "We are in no hurry!", "Take your time, bro!", "☆*:.｡.o(≧▽≦)o.｡.:*☆", "°˖✧◝(⁰▿⁰)◜✧˖°"
	]
	shuffleArray(randomMessages)
	setMessage(randomMessages.slice(0, 2), false)

	helpTimeout = setTimeout(sendRandomMessage, 30000)
}

function createLevel() {
	setBgColors()
	//bottomTextText = "Generating level, please wait!"

	//after timeout, to give time to write text
	var timeToWait = 180
	setTimeout(function() {
		pTextPos.y = -1500 //to avoid cross positioning
		startTime2 = new Date();

		isCinematic = false
		//toDrawPieces = true
		endCinematicState = 999
		center2Alpha = 0
		showFire = true
		showLoading = false

		setTimeout(function() {
			showFire = false
		}, 1000)
		setTimeout(function() {
			zzfx(...[effectVolume, , 192, .02, .01, .24, , .45, 3.1, -4.6, , , , , , , , .5])
		}, 500)


		if (gameModes[currentGameMode] == "CLASSIC") {
			numberOfPolyominos = 4
			sizeOfPolyominos = 4
			mixed = false
			margin = 2
		} else if (gameModes[currentGameMode] == "MIX") {
			numberOfPolyominos = 8
			sizeOfPolyominos = 5
			mixed = true
			margin = 5
		} else if (gameModes[currentGameMode] == "EZPZ") {
			numberOfPolyominos = 3
			sizeOfPolyominos = 4
			mixed = false
			margin = 0
		} else if (gameModes[currentGameMode] == "PENTA") {
			numberOfPolyominos = 5
			sizeOfPolyominos = 5
			mixed = false
			margin = 10
		} else if (gameModes[currentGameMode] == "KIDS") {
			numberOfPolyominos = 2
			sizeOfPolyominos = 7
			mixed = true
			margin = 0
		}

		if (polyLeft < numberOfPolyominos) {
			numberOfPolyominos = polyLeft
		}


		generateLevel(numberOfPolyominos, sizeOfPolyominos, margin, mixed)
	}, timeToWait);
}


function checkCompleted() {
	if (state == "game") {
		var completed = true
		for (let kk = 0; kk < pieces.length; kk++) {
			var currentPiece = pieces[kk]
			for (let j = 0; j < currentPiece.blocks.length; j++) {
				var currentBlock = currentPiece.blocks[j]
				var xx = currentBlock[0] * blockSize + currentPiece.originalPosition.x
				var yy = currentBlock[1] * blockSize + currentPiece.originalPosition.y
				if (bag.contains(xx, yy) == false || collideWithOtherPieces(currentPiece, pieces)) {
					completed = false
					break
				}
			}
			if (completed == false) break
		}
		return completed
	}
	return false
}



function removeUnusedBagSpaces() {
	var newBagBlocks = []
	for (let i = 0; i < bag.blocks.length; i++) {

		let currentBlockk = bag.blocks[i]
		let isBlockContained = false
		for (let kk = 0; kk < pieces.length; kk++) {
			let currentPieceP = pieces[kk]
			if (currentPieceP.contains(currentBlockk[0] * blockSize + bag.originalPosition.x, currentBlockk[1] * blockSize + bag.originalPosition.y)) {
				isBlockContained = true
				break
			}
		}
		if (isBlockContained == true) {
			newBagBlocks.push(currentBlockk)
		}
	}
	bag.blocks = newBagBlocks
}


function collideWithOtherPieces(_piece, _otherPieces) {
	for (let k = 0; k < _piece.blocks.length; k++) {

		for (let uu = 0; uu < _otherPieces.length; uu++) {
			var otherPiece = _otherPieces[uu]
			if (otherPiece == _piece) break



			var currentPieceBlock = _piece.blocks[k]
			var currentPieceBlockX = currentPieceBlock[0] * blockSize + _piece.originalPosition.x
			var currentPieceBlockY = currentPieceBlock[1] * blockSize + _piece.originalPosition.y

			for (let i = 0; i < otherPiece.blocks.length; i++) {
				var currentAreaBlock = otherPiece.blocks[i]
				var currentAreaBlockX = currentAreaBlock[0] * blockSize + otherPiece.originalPosition.x
				var currentAreaBlockY = currentAreaBlock[1] * blockSize + otherPiece.originalPosition.y

				if (currentAreaBlockX >= currentPieceBlockX - bSize && currentAreaBlockX <= currentPieceBlockX + bSize && currentAreaBlockY >= currentPieceBlockY - bSize && currentAreaBlockY <= currentPieceBlockY + bSize) {
					return otherPiece
				}
			}


		}

	}

	return false
}



function checkIfPieceFits(_area, _piece) {

	var contained = 0

	for (let k = 0; k < _piece.blocks.length; k++) {


		var currentPieceBlock = _piece.blocks[k]
		var currentPieceBlockX = currentPieceBlock[0] * blockSize + _piece.originalPosition.x
		var currentPieceBlockY = currentPieceBlock[1] * blockSize + _piece.originalPosition.y

		for (let i = 0; i < _area.blocks.length; i++) {
			var currentAreaBlock = _area.blocks[i]
			var currentAreaBlockX = currentAreaBlock[0] * blockSize + _area.originalPosition.x
			var currentAreaBlockY = currentAreaBlock[1] * blockSize + _area.originalPosition.y

			if (currentAreaBlockX >= currentPieceBlockX - bSize && currentAreaBlockX <= currentPieceBlockX + bSize && currentAreaBlockY >= currentPieceBlockY - bSize && currentAreaBlockY <= currentPieceBlockY + bSize) {
				contained++
			}
		}


	}

	if (contained == _piece.blocks.length) {
		return true
	}

	return false
}

function scramblePieces() {
	//randomize order
	let newPieces = [...pieces]
	shuffleArray(newPieces)
	pieces = newPieces

	var yy = h / 4
	var xx = 0
	for (let i = 0; i < pieces.length; i++) {
		//oder position

		if (i == 3) {
			yy = h / 3
			xx = 0
		} else if (i == 6) {
			yy = h / 2
			xx = 0
		}

		pieces[i].originalPosition.x = w / 2 + 50 * xx
		pieces[i].originalPosition.y = yy

		xx++

		//randomize rotation
		for (let k = 0; k < Math.floor(Math.random() * 4); k++) {
			pieces[i].rotate()
		}
	}
}

/*
===============================================   THIRD PARTY UTILITIES   ===============================================
*/

//https: //riptutorial.com/html5-canvas/example/18766/render-a-rounded-polygon-
var roundedPoly = function(points, radius) {
	var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut;
	var asVec = function(p, pp, v) { // convert points to a line with len and normalised
		v.x = pp.x - p.x; // x,y as vec
		v.y = pp.y - p.y;
		v.len = Math.sqrt(v.x * v.x + v.y * v.y); // length of vec
		v.nx = v.x / v.len; // normalised
		v.ny = v.y / v.len;
		v.ang = Math.atan2(v.ny, v.nx); // direction of vec
	}
	v1 = {};
	v2 = {};
	len = points.length; // number points
	p1 = points[len - 1]; // start at end of path
	for (i = 0; i < len; i++) { // do each corner
		p2 = points[(i) % len]; // the corner point that is being rounded
		p3 = points[(i + 1) % len];
		// get the corner as vectors out away from corner
		asVec(p2, p1, v1); // vec back from corner point
		asVec(p2, p3, v2); // vec forward from corner point
		// get corners cross product (asin of angle)
		sinA = v1.nx * v2.ny - v1.ny * v2.nx; // cross product
		// get cross product of first line and perpendicular second line
		sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny; // cross product to normal of line 2
		angle = Math.asin(sinA); // get the angle
		radDirection = 1; // may need to reverse the radius
		drawDirection = false; // may need to draw the arc anticlockwise
		// find the correct quadrant for circle center
		if (sinA90 < 0) {
			if (angle < 0) {
				angle = Math.PI + angle; // add 180 to move us to the 3 quadrant
			} else {
				angle = Math.PI - angle; // move back into the 2nd quadrant
				radDirection = -1;
				drawDirection = true;
			}
		} else {
			if (angle > 0) {
				radDirection = -1;
				drawDirection = true;
			}
		}
		halfAngle = angle / 2;
		// get distance from corner to point where round corner touches line
		lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
		if (lenOut > Math.min(v1.len / 2, v2.len / 2)) { // fix if longer than half line length
			lenOut = Math.min(v1.len / 2, v2.len / 2);
			// ajust the radius of corner rounding to fit
			cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
		} else {
			cRadius = radius;
		}
		x = p2.x + v2.nx * lenOut; // move out from corner along second line to point where rounded circle touches
		y = p2.y + v2.ny * lenOut;
		x += -v2.ny * cRadius * radDirection; // move away from line to circle center
		y += v2.nx * cRadius * radDirection;
		// x,y is the rounded corner circle center
		ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection); // draw the arc clockwise
		p1 = p2;
		p2 = p3;
	}
	ctx.closePath();
}



//https://stackoverflow.com/questions/8110313/add-points-after-every-3-digits-on-all-text-fields-with-js/8110352
//https://blog.abelotech.com/posts/number-currency-formatting-javascript/
function currFormat(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

//https://stackoverflow.com/questions/53311809/all-possible-combinations-of-a-2d-array-in-javascript
function allCombinationsOfArray(list, n = 0, result = [], current = []) {
	if (n === list.length) result.push(current)
	else list[n].forEach(item => allCombinationsOfArray(list, n + 1, result, [...current, item]))

	return result
}


//https: //stackoverflow.com/questions/9960908/permutations-in-javascript/37580979#37580979
function permute(_array) {
	let length = _array.length,
		result = [_array.slice()],
		c = new Array(length).fill(0),
		i = 1,
		k, p;

	while (i < length) {
		if (c[i] < i) {
			k = i % 2 && c[i];
			p = _array[i];
			_array[i] = _array[k];
			_array[k] = p;
			++c[i];
			i = 1;
			result.push(_array.slice());
		} else {
			c[i] = 0;
			++i;
		}
	}
	return result;
}

//basic lerp
//https://codepen.io/ma77os/pen/KGIEh
function lerp(start, end, amt) {
	return (1 - amt) * start + amt * end
}

//https://www.geeksforgeeks.org/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
//https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
function getMousePos(canvas, event) {
	var canvasBounds = canvas.getBoundingClientRect();

	//simple proportion ratio
	return {
		x: (event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left) * w,
		y: (event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top) * h
	};
}

//https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x + r, y);
	this.arcTo(x + w, y, x + w, y + h, r);
	this.arcTo(x + w, y + h, x, y + h, r);
	this.arcTo(x, y + h, x, y, r);
	this.arcTo(x, y, x + w, y, r);
	this.closePath();
	return this;
}


//https://codegolf.stackexchange.com/questions/45302/random-golf-of-the-day-1-shuffle-an-array
shuffleArray = a => (a.map((c, i) => (a[i] = a[j = Math.random() * ++i | 0], a[j] = c)), a)



/*
===============================================   KEYBOARD HANDLING & OTHER TESTING FUNCTIONS   ===============================================
*/


/*
//REMOVE IN PRODUCTION!
function saveSolution() {
	solution = []
	for (let kk = 0; kk < pieces.length; kk++) {
		solution[pieces[kk].name] = {
			x: pieces[kk].originalPosition.x - bag.originalPosition.x,
			y: pieces[kk].originalPosition.y - bag.originalPosition.y,
			angle: pieces[kk].angle
		}
	}
}
//REMOVE IN PRODUCTION!
function restoreSolution() {
	for (let kk = 0; kk < pieces.length; kk++) {
		pieces[kk].originalPosition.x = solution[pieces[kk].name].x + bag.originalPosition.x
		pieces[kk].originalPosition.y = solution[pieces[kk].name].y + bag.originalPosition.y
		pieces[kk].rotateTo(solution[pieces[kk].name].angle)
	}
}



//REMOVE IN PRODUCTION!
function keyUp(e) {
	if (e.keyCode == 81 && GENERATING == false) {
		createLevel()
	}
	if (e.keyCode == 69 && GENERATING == false) {
		//checkSolutionWithRotations()
		if (solution != null) {
			restoreSolution()

		}
	}

	if (e.keyCode == 82 && draggedBlock != null) {
		draggedBlock.rotate()
	}

	if (e.keyCode == 82 && lastDraggedBlock != null) {
		lastDraggedBlock.rotate()
	}
}

this.onkeyup = keyUp;

*/

/*
===============================================   MOUSE HANDLING   ===============================================
*/


function mouseDown(e) {
	isMousePressed = true
	var pos = getMousePos(c, e)
	mouseX = pos.x
	mouseY = pos.y

	startingMouseX = pos.x
	startingMouseY = pos.y

	var now = new Date().getTime();
	var timesince = now - mylatesttap;

	if (gameStarted == true && isCinematic == false) {


		if ((timesince < 300) && (timesince > 0)) {
			//if (e.detail > 1) {

			//DOUBLE TAP
			draggedBlock = null
			lastDraggedBlock = null

			for (let i = 0; i < pieces.length; i++) {
				var piece = pieces[i]
				if (piece.contains(mouseX, mouseY)) {
					zzfx(...[effectVolume, , 314, .01, .01, .13, 1, 1.66, 4.9, , , , , , , , .01, .92, .05]); //Rotate
					piece.rotate()
					break //only 1 piece draggable per time

				}
			}

		} else {
			//SINGLE TAP
			for (let i = 0; i < pieces.length; i++) {
				var piece = pieces[i]
				if (piece.contains(mouseX, mouseY)) {
					piece.color = piece.pickColor
					piece.isDragged = true
					draggedBlock = piece
					zzfx(...[effectVolume * 0.5, , 56, .04, .03, .01, , 1.39, 97, , -114, .15, , , , , , .73, .01, .08]); //pick
					break //only 1 piece draggable per time
				}
			}
			if (draggedBlock != null) {
				pieces.push(pieces.splice(pieces.indexOf(draggedBlock), 1)[0]);
			}
		}
	}


	for (let i = 0; i < buttons.length; i++) {
		var button = buttons[i]
		if (button.contains(mouseX, mouseY)) {
			button.isPressed = true
		}
	}



	mylatesttap = new Date().getTime();


}



function mouseUp(e) {
	isMousePressed = false

	var pos = getMousePos(c, e)
	mouseX = pos.x
	mouseY = pos.y
	for (let i = 0; i < pieces.length; i++) {
		var piece = pieces[i]
		piece.color = piece.originalColor
		piece.isDragged = false
	}


	if (draggedBlock != null) {
		zzfx(...[effectVolume * 0.5, , 56, .04, .03, .01, , 1.39, 96.9, .2, -114, .16, , , , .1, , .73, .02, .08]);
	}
	lastDraggedBlock = draggedBlock
	draggedBlock = null

	if (state == "story-intro" && canSkip == true) {

		if (skipState == 0) {
			if (storyTimeOut != null) clearTimeout(storyTimeOut)
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			storyMessage.message = storyMessage.fullMessage
			clearTimeout(storyMessage.timeout)
			skipState = 1
			animateMouth = false
		} else if (skipState == 1) {
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			story12()
		} else if (skipState == 2) {
			if (storyTimeOut != null) clearTimeout(storyTimeOut)
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			storyMessage.message = storyMessage.fullMessage
			clearTimeout(storyMessage.timeout)
			skipState = 3
			animateMouth = false
		} else if (skipState == 3) {
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			story13()
			skipState = 4
		} else if (skipState == 4) {
			if (storyTimeOut != null) clearTimeout(storyTimeOut)
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			storyMessage.message = storyMessage.fullMessage
			clearTimeout(storyMessage.timeout)
			skipState = 5
			animateMouth = false

		} else if (skipState == 5) {
			if (storyTimeOut != null) clearTimeout(storyTimeOut)
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			setStoryMessage([""])
			storyState = 1
			saveData("storyState", storyState.toString())
			polyLeft = 13
			currentPolyTextToShow = 13
			saveData("polyLeft", polyLeft.toString())
			gotoMenu()
			skipState = 6
			animateMouth = false
		}
	}

	if (state == "story-middle" && canSkip == true) {
		if (skipState == 0) {
			if (storyTimeOut != null) clearTimeout(storyTimeOut)
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			storyMessage.message = storyMessage.fullMessage
			clearTimeout(storyMessage.timeout)
			skipState = 1
			animateMouth = false
		} else if (skipState == 1) {
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			story22()
		} else if (skipState == 2) {
			if (storyTimeOut != null) clearTimeout(storyTimeOut)
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			storyMessage.message = storyMessage.fullMessage
			clearTimeout(storyMessage.timeout)
			animateMouth = false
			skipState = 3
		} else if (skipState == 3) {
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			setStoryMessage([""])
			storyState = 3
			saveData("storyState", storyState.toString())

			gotoMenu()
			animateMouth = false
		}
	}

	if (state == "story-ending" && canSkip == true) {
		if (skipState == 0) {
			if (storyTimeOut != null) clearTimeout(storyTimeOut)
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			storyMessage.message = storyMessage.fullMessage
			clearTimeout(storyMessage.timeout)
			skipState = 1
			animateMouth = false
		} else if (skipState == 1) {
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			story32()
		} else if (skipState == 2) {
			if (storyTimeOut != null) clearTimeout(storyTimeOut)
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click
			storyMessage.message = storyMessage.fullMessage
			clearTimeout(storyMessage.timeout)
			skipState = 3
			animateMouth = false
		} else if (skipState == 3) {
			//RESET GAME VAR ETC
			saveData("showTutorial", "true")
			saveData("storyState", "0")
			saveData("polyLeft", 13)
			animateMouth = false
			//saveData("muted", "false") //mute can stay as it is
			location.reload();
			return false;
		}
	}


	if (state == "game" && checkCompleted() == true && GENERATING == false && gameStarted == true && isCinematic == false) {
		zzfx(...[effectVolume, , 155, .05, .23, .59, , .76, 8.2, , 120, .09, .15, .1, , , , .96, .02, .21]); //Win

		showTutorial = false
		saveData("showTutorial", "false")

		//createLevel()
		//gameStarted = false
		isCinematic = true
		endCinematicState = 0
		setMessage([""])
		if (helpTimeout) clearTimeout(helpTimeout)

		setTimeout(function() {
			zzfx(...[effectVolume, , 65.40639, .01, .17, .17, , 1.06, 7.9, -3.7, , , , , , , , .53, .11])
			showFire = true
			toDrawPieces = false
			endCinematicState = 1
			setTimeout(function() {
				//
				polyLeft -= numberOfPolyominos
				saveData("polyLeft", polyLeft.toString())
				if (polyLeft > 0) {
					createLevel()
				} else {
					isCinematic = false
					toDrawPieces = true
					endCinematicState = 999
					center2Alpha = 0
					showLoading = false
					backButton.originalx = -500

					//
					if (storyState == 1) {


						//instantly set polyleft to 13k!
						//so if the player reloads the game during story-middle, they are not 0
						//if the player reloads during ship transition, they stay as they were before
						//btw there is a problem if the player reloads between the two saveData
						//in that case polyleft would be 0
						polyLeft = 13312
						currentPolyTextToShow = 13312
						saveData("polyLeft", polyLeft.toString())

						storyState = 2
						saveData("storyState", storyState.toString())
						state = "story-middle"
						animateMouth = true
						canSkip = true
						setStoryMessage(["Look, ehm ...", "I don't know how to", "tell you this ...", " ", "Remember when I said", "there were '13 Blockychums'", "to be rescued?", "My ... bad, they are actually", "13 ... THOUSAND."])



						//setMessage(["Click to continue"], true)
						skipState = 0
						animateMouth = true
						storyTimeOut = setTimeout(function() {
							skipState = 1
							animateMouth = false
						}, 9000)

					} else if (storyState == 3) {
						storyState = 4
						saveData("storyState", storyState.toString())
						state = "story-ending"
						//setMessage(["Click to continue"], true)
						canSkip = true
						animateMouth = true
						setStoryMessage(["PACKABUNCHAS!!!", "We did it, Spacey!!!", " ", "WE ACTUALLY RESCUED ALL", "the 13.312 Blockychums!", " ",
							"Let's celebrate!", " ", "(ﾉ^ヮ^)ﾉ*:・ﾟ✧"
						])



						skipState = 0
						storyTimeOut = setTimeout(function() {
							skipState = 1
							animateMouth = false
						}, 7000)

					}

				}

			}, 1000)
			setTimeout(function() {
				endCinematicState = 2
				showLoading = true
			}, 500)
		}, 500)
	}

	for (let i = 0; i < buttons.length; i++) {
		var button = buttons[i]
		if (button.contains(mouseX, mouseY)) {
			zzfx(...[effectVolume, , 21, .02, , .04, 1, 2.15, 42, , , , , , 1, , , , , .96]); //Button click			
			button.onClick()
		}
		button.isPressed = false
	}



	if (state == "title") {
		state = "title-transitioning"


		showLoading = true

		if (storyState == 2) {
			//it cannot be state 2
			//because it would mean that the player reloaded while watching
			//the middle story!
			//so it's right to put it at story 3!
			storyState = 3
			saveData("storyState", storyState.toString())
		}

		//In case player reloads page during ending
		//state is set as pre-ending
		//and polyleft set to 1
		//
		if (polyLeft == 0) {
			polyLeft = 1
			storyState = 3
			saveData("storyState", storyState.toString())
			currentPolyTextToShow = 1
			saveData("polyLeft", polyLeft.toString())
		}


		setTimeout(function() {
			if (music == null) {
				music = zzfxX = new(window.AudioContext || webkitAudioContext);

				const songData = [
					[
						[.5, 0, 4e3, , , .03, , 1.25, , , , , .02, 6.8, -.3],
						[.5, 0, 8e3, , , .03, 2, 1.25, , , , , .02, 6.8, -.3],
						[.5, 0, 80, , .08, .5, 3]
					],
					[
						[
							[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
							[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
							[2, , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , ],
							[2, , 10, , , , 10, , , , , , 10, , , , 10, , , , , , , , , , 10, , , , 10, , , , 10, , , , 10, , , , , , 10, , , , 10, , , , , , , , , , 10, , , , 10, , , , ],
							[2, , 14, , , , 14, , , , , , 14, , , , 14, , , , , , , , , , 14, , , , 14, , , , 17, , , , 17, , , , , , 17, , , , 17, , , , , , , , , , 17, , , , 17, , , , ],
							[2, , 21, , , , 21, , , , , , 21, , , , 21, , , , , , , , , , 21, , , , 21, , , , 19, , , , 19, , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , ]
						],
						[
							[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
							[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
							[2, , 5, , , , , , 5, , 12, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , ],
							[2, , 9, , , , 9, , , , , , 9, , , , 9, , , , , , , , , , 9, , , , 9, , , , 9, , , , 9, , , , , , 9, , , , 9, , , , , , , , , , 9, , , , 9, , , , ],
							[2, , 15, , , , 15, , , , , , 15, , , , 15, , , , , , , , , , 15, , , , 15, , , , 14, , , , 14, , , , , , 14, , , , 14, , , , , , , , , , 14, , , , 14, , , , ],
							[2, , 21, , , , 21, , , , , , 21, , , , 21, , , , , , , , , , 21, , , , 21, , , , 17, , , , 17, , , , , , 17, , , , 17, , , , , , , , , , 17, , , , 17, , , , ]
						],
						[
							[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
							[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
							[2, , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 3, , , , , , 3, , 7, , , , , , , , 3, , , , , , 3, , 7, , , , , , , , ],
							[2, , 8, , , , 8, , , , , , 8, , , , 8, , , , , , , , , , 8, , , , 8, , , , 10, , , , 10, , , , , , 10, , , , 10, , , , , , , , , , 10, , , , 10, , , , ],
							[2, , 14, , , , 14, , , , , , 14, , , , 14, , , , , , , , , , 14, , , , 14, , , , 14, , , , 14, , , , , , 14, , , , 14, , , , , , , , , , 14, , , , 14, , , , ],
							[2, , 29, , , , 29, , , , , , 29, , , , 29, , , , , , , , , , 29, , , , 29, , , , 29, , , , 19, , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , ]
						],
						[
							[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
							[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
							[2, , 12, , , , , , 12, , 19, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , ],
							[2, , 10, , , , 10, , , , , , 10, , , , 10, , , , , , , , , , 10, , , , 10, , , , 9, , , , 9, , , , , , 9, , , , 9, , , , , , , , , , 9, , , , 9, , , , ],
							[2, , 15, , , , 15, , , , , , 15, , , , 15, , , , , , , , , , 15, , , , 15, , , , 17, , , , 17, , , , , , 17, , , , 17, , , , , , , , , , 17, , , , 17, , , , ],
							[2, , 19, , , , 19, , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , 19, , , , 19, , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , ]
						],
						[
							[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
							[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
							[2, , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , ],
							[2, , 10, , , , , , , , , , , , , , , , , , , , , , , , 10, , , , , , , , , , , , , , , , , , 10, , , , 10, , , , , , , , , , 10, , , , 10, , , , ],
							[2, , 14, , , , , , , , , , , , , , , , , , , , , , , , 14, , , , , , , , , , , , , , , , , , 17, , , , 17, , , , , , , , , , 17, , , , 17, , , , ],
							[2, , 21, , , , , , , , , , , , , , , , , , , , , , , , 21, , , , , , , , , , , , , , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , ],
							[2, , , , , , , , , , , , , , , , , , , , , , , , , , 33, , 31, , 29, , , , 31, , , , 24, , , , , , , , , , , , , , , , , , , , 33, , 31, , 29, , , , ]
						],
						[
							[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
							[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
							[2, , 5, , , , , , 5, , 12, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , ],
							[2, , 9, , , , , , , , , , , , , , 9, , , , , , , , , , , , , , , , , , 9, , , , 9, , , , , , 9, , , , 9, , , , , , , , , , 9, , , , , , , , ],
							[2, , 15, , , , , , , , , , , , , , 15, , , , , , , , , , , , , , , , , , 14, , , , 14, , , , , , 14, , , , 14, , , , , , , , , , 14, , , , , , , , ],
							[2, , 21, , , , , , , , , , , , , , 21, , , , , , , , , , , , , , , , , , 17, , , , 17, , , , , , 17, , , , 17, , , , , , , , , , 17, , , , , , , , ],
							[2, , 27, , , , 24, , , , , , , , , , , , , , , , , , , , 33, , 32, , 31, , 33, , 29, , , , , , , , , , , , , , , , , , , , 26, , , , 27, , , , 29, , , , ]
						],
						[
							[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
							[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
							[2, , 10, , , , , , 10, , 17, , , , , , , , 10, , , , , , 10, , 17, , , , , , , , 3, , , , , , 3, , 7, , , , , , , , 3, , , , , , 3, , 7, , , , , , , , ],
							[2, , 8, , , , , , , , , , , , , , 8, , , , , , , , , , 8, , , , 8, , , , 10, , , , , , , , , , , , , , , , , , , , , , , , 10, , , , 10, , , , ],
							[2, , 14, , , , , , , , , , , , , , 14, , , , , , , , , , 14, , , , 14, , , , 14, , , , , , , , , , , , , , , , , , , , , , , , 14, , , , 14, , , , ],
							[2, , 29, , , , , , , , , , , , , , 29, , , , , , , , , , 29, , , , 29, , , , 29, , , , , , , , , , , , , , , , , , , , , , , , 19, , , , 19, , , , ],
							[2, , 29, , , , 26, , , , , , , , , , , , , , , , , , , , 29, , 27, , 26, , , , 27, , , , 24, , , , , , , , , , , , , , , , , , , , 24, , 26, , 27, , , , ]
						],
						[
							[, , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , 1, , , , , , 1, , 1, , , , , , 1, , , , , , , , 1, , 1, , , , , , , , ],
							[1, , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , , , , , 1, , , , , , 1, , , , , , , , 1, , , , , , , , , , 1, , , , ],
							[2, , 12, , , , , , 12, , 19, , , , , , , , 12, , , , , , 12, , 19, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , 5, , , , , , 5, , 12, , , , , , , , ],
							[2, , 10, , , , , , , , , , , , , , , , , , , , , , , , 10, , , , 10, , , , 9, , , , , , , , , , 9, , , , 9, , , , , , , , , , 9, , , , 9, , , , ],
							[2, , 15, , , , , , , , , , , , , , , , , , , , , , , , 15, , , , 15, , , , 17, , , , , , , , , , 17, , , , 17, , , , , , , , , , 17, , , , 17, , , , ],
							[2, , 19, , , , , , , , , , , , , , , , , , , , , , , , 19, , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , , , , , , , 19, , , , 19, , , , ],
							[2, , 26, , , , 24, , , , , , , , , , , , , , , , , , , , 27, , , , 27, , , , 26, , , , 24, , , , 22, , , , 24, , , , 22, , , , , , , , 21, , , , , , , , ]
						]
					],
					[4, 5, 6, 7, 0, 1, 2, 3], 120
					/*
					UNUSED SONG DATA
					, {
						"title": "New Song",
						"instruments": ["Hihat", "Hihat", "Piano"],
						"patterns": ["acc1", "acc2", "acc3", "acc4", "simp1", "simp2", "simp3", "simp4"]
					}
					*/
				]

				const buffer = zzfxM(...songData); // Generate the sample data
				const node = zzfxP(...buffer); // Play the song

				node.loop = true


				if (muted == true) {
					muted = false
					mute()
				}
				showLoading = false

				if (storyState == 0) {
					state = "story-intro"
					setMessage([""], true)
					canSkip = false
					skipState = 0
					canSkip = true
					animateMouth = true


					setStoryMessage(["Hey Spacey, wake up!", "Guess what happened today.", "Yeah.", "Those 13 Blockychums", "got lost in the galaxy", " ", "AGAIN!"])
					//setMessage(["Click to continue"], true)



					storyTimeOut = setTimeout(function() {
						skipState = 1
						animateMouth = false
					}, 6000)

					//setTimeout(function() {

					//	setMessage(["Click to skip"], true)
					//}, 1000)
				} else {

					gotoMenu()
				}

			}
		}, 500)


	}


}



function gotoMenu() {
	state = "menu"
	leftButton.originalx = w * 0.15
	//leftButton.x = -500
	rightButton.originalx = w * 0.85
	//rightButton.x = w + 500
	startButton.originaly = h * 0.75
	//startButton.y = h + 500
	fullScreenButton.originalx = w * 0.11

	draggedBlock = null
	lastDraggedBlock = null
	gameStarted = false
	pieces = []
	bag = {}

	pTextPos.y = 3000 //to avoid cross positioning

	setMessage(["Pick a game mode!"], true)
}

function mouseMove(e) {

	var pos = getMousePos(c, e)
	mouseX = pos.x
	mouseY = pos.y

	var diffX = mouseX - startingMouseX
	var diffY = mouseY - startingMouseY
	if (gameStarted == true && isCinematic == false) {
		for (let i = 0; i < pieces.length; i++) {
			var piece = pieces[i]
			if (piece.isDragged == true) {
				piece.originalPosition.x += diffX
				piece.originalPosition.y += diffY
			}
		}
	}

	startingMouseX = pos.x
	startingMouseY = pos.y

	for (let i = 0; i < buttons.length; i++) {
		var button = buttons[i]
		if (!button.contains(mouseX, mouseY)) {
			button.isPressed = false
		} else {
			if (isMousePressed == true) button.isPressed = true
		}
	}


}

function touchstart(e) {
	e.preventDefault()
	if (e.touches.length > 1) {
		//the event is multi-touch
		//you can then prevent the behavior
		//event.preventDefault()
	} else {
		var touches = e.changedTouches;

		//for (var i = 0; i < touches.length; i++) {
		mouseDown(touches[0])
		//}
	}


}

function touchend(e) {
	e.preventDefault()
	if (e.touches.length > 1) {
		//the event is multi-touch
		//you can then prevent the behavior

	} else {
		var touches = e.changedTouches;

		//for (var i = 0; i < touches.length; i++) {
		mouseUp(touches[0])
		//}
	}

}


function touchmove(e) {
	e.preventDefault()
	if (e.touches.length > 1) {
		//the event is multi-touch
		//you can then prevent the behavior

	} else {
		var touches = e.changedTouches;

		//for (var i = 0; i < touches.length; i++) {
		mouseMove(touches[0])
		//}
	}

}

/*
===============================================   STORAGE   ===============================================
*/
//prefix to be sure and stay safe no other games use the same item name


function saveData(item, data) {
	localStorage.setItem("packabunchas_" + item, data)
}

function loadData(item, _default) {
	return localStorage.getItem("packabunchas_" + item) || _default
}

/*
===============================================   MUTE TOGGLE   ===============================================
*/

function mute() {
	if (muted == false) {
		muteButton.text = ""
		musicVolume = 0
		zzfxV = musicVolume
		muted = true
		music.suspend()
		saveData("muted", "true")
	} else {
		muteButton.text = ""
		musicVolume = .1
		zzfxV = musicVolume
		muted = false
		music.resume()
		saveData("muted", "false")
	}
}

/*
===============================================   AUDIO SECTION   ===============================================
*/

//https://github.com/keithclark/ZzFXM

// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
zzfx = (...t) => zzfxP(zzfxG(...t))

// zzfxP() - the sound player -- returns a AudioBufferSourceNode
zzfxP = (...t) => {
	let e = zzfxX.createBufferSource(),
		f = zzfxX.createBuffer(t.length, t[0].length, zzfxR);
	t.map((d, i) => f.getChannelData(i).set(d)), e.buffer = f, e.connect(zzfxX.destination), e.start();
	return e
}

// zzfxG() - the sound generator -- returns an array of sample data
zzfxG = (q = 1, k = .05, c = 220, e = 0, t = 0, u = .1, r = 0, F = 1, v = 0, z = 0, w = 0, A = 0, l = 0, B = 0, x = 0, G = 0, d = 0, y = 1, m = 0, C = 0) => {
	let b = 2 * Math.PI,
		H = v *= 500 * b / zzfxR ** 2,
		I = (0 < x ? 1 : -1) * b / 4,
		D = c *= (1 + 2 * k * Math.random() - k) * b / zzfxR,
		Z = [],
		g = 0,
		E = 0,
		a = 0,
		n = 1,
		J = 0,
		K = 0,
		f = 0,
		p, h;
	e = 99 + zzfxR * e;
	m *= zzfxR;
	t *= zzfxR;
	u *= zzfxR;
	d *= zzfxR;
	z *= 500 * b / zzfxR ** 3;
	x *= b / zzfxR;
	w *= b / zzfxR;
	A *= zzfxR;
	l = zzfxR * l | 0;
	for (h = e + m + t + u + d | 0; a < h; Z[a++] = f) ++K % (100 * G | 0) || (f = r ? 1 < r ? 2 < r ? 3 < r ? Math.sin((g % b) ** 3) : Math.max(Math.min(Math.tan(g), 1), -1) : 1 - (2 * g / b % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(g / b) - g / b) : Math.sin(g), f = (l ? 1 - C + C * Math.sin(2 * Math.PI * a / l) : 1) * (0 < f ? 1 : -1) * Math.abs(f) ** F * q * zzfxV * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - y) : a < e + m + t ? y : a < h - d ? (h - a - d) / u * y : 0), f = d ? f / 2 + (d > a ? 0 : (a < h - d ? 1 : (h - a) / d) * Z[a - d | 0] / 2) : f), p = (c += v += z) * Math.sin(E * x - I), g += p - p * B * (1 - 1E9 * (Math.sin(a) + 1) % 2), E += p - p * B * (1 - 1E9 * (Math.sin(a) ** 2 + 1) % 2), n && ++n > A && (c += w, D += w, n = 0), !l || ++J % l || (c = D, v = H, n = n || 1);
	return Z
}

// zzfxV - global volume
zzfxV = musicVolume

// zzfxR - global sample rate
zzfxR = 44100

// zzfxX - the common audio context
//zzfxX = new(window.AudioContext || webkitAudioContext);


/**
 * ZzFX Music Renderer v2.0.3 by Keith Clark and Frank Force
 */

/**
 * @typedef Channel
 * @type {Array.<Number>}
 * @property {Number} 0 - Channel instrument
 * @property {Number} 1 - Channel panning (-1 to +1)
 * @property {Number} 2 - Note
 */

/**
 * @typedef Pattern
 * @type {Array.<Channel>}
 */

/**
 * @typedef Instrument
 * @type {Array.<Number>} ZzFX sound parameters
 */

/**
 * Generate a song
 *
 * @param {Array.<Instrument>} instruments - Array of ZzFX sound paramaters.
 * @param {Array.<Pattern>} patterns - Array of pattern data.
 * @param {Array.<Number>} sequence - Array of pattern indexes.
 * @param {Number} [speed=125] - Playback speed of the song (in BPM).
 * @returns {Array.<Array.<Number>>} Left and right channel sample data.
 */

zzfxM = (instruments, patterns, sequence, BPM = 125) => {
	let instrumentParameters;
	let i;
	let j;
	let k;
	let note;
	let sample;
	let patternChannel;
	let notFirstBeat;
	let stop;
	let instrument;
	let pitch;
	let attenuation;
	let outSampleOffset;
	let isSequenceEnd;
	let sampleOffset = 0;
	let nextSampleOffset;
	let sampleBuffer = [];
	let leftChannelBuffer = [];
	let rightChannelBuffer = [];
	let channelIndex = 0;
	let panning = 0;
	let hasMore = 1;
	let sampleCache = {};
	let beatLength = zzfxR / BPM * 60 >> 2;

	// for each channel in order until there are no more
	for (; hasMore; channelIndex++) {

		// reset current values
		sampleBuffer = [hasMore = notFirstBeat = pitch = outSampleOffset = 0];

		// for each pattern in sequence
		sequence.map((patternIndex, sequenceIndex) => {
			// get pattern for current channel, use empty 1 note pattern if none found
			patternChannel = patterns[patternIndex][channelIndex] || [0, 0, 0];

			// check if there are more channels
			hasMore |= !!patterns[patternIndex][channelIndex];

			// get next offset, use the length of first channel
			nextSampleOffset = outSampleOffset + (patterns[patternIndex][0].length - 2 - !notFirstBeat) * beatLength;
			// for each beat in pattern, plus one extra if end of sequence
			isSequenceEnd = sequenceIndex == sequence.length - 1;
			for (i = 2, k = outSampleOffset; i < patternChannel.length + isSequenceEnd; notFirstBeat = ++i) {

				// <channel-note>
				note = patternChannel[i];

				// stop if end, different instrument or new note
				stop = i == patternChannel.length + isSequenceEnd - 1 && isSequenceEnd ||
					instrument != (patternChannel[0] || 0) | note | 0;

				// fill buffer with samples for previous beat, most cpu intensive part
				for (j = 0; j < beatLength && notFirstBeat;

					// fade off attenuation at end of beat if stopping note, prevents clicking
					j++ > beatLength - 99 && stop ? attenuation += (attenuation < 1) / 99 : 0
				) {
					// copy sample to stereo buffers with panning
					sample = (1 - attenuation) * sampleBuffer[sampleOffset++] / 2 || 0;
					leftChannelBuffer[k] = (leftChannelBuffer[k] || 0) - sample * panning + sample;
					rightChannelBuffer[k] = (rightChannelBuffer[k++] || 0) + sample * panning + sample;
				}

				// set up for next note
				if (note) {
					// set attenuation
					attenuation = note % 1;
					panning = patternChannel[1] || 0;
					if (note |= 0) {
						// get cached sample
						sampleBuffer = sampleCache[
							[
								instrument = patternChannel[sampleOffset = 0] || 0,
								note
							]
						] = sampleCache[[instrument, note]] || (
							// add sample to cache
							instrumentParameters = [...instruments[instrument]],
							instrumentParameters[2] *= 2 ** ((note - 12) / 12),

							// allow negative values to stop notes
							note > 0 ? zzfxG(...instrumentParameters) : []
						);
					}
				}
			}

			// update the sample offset
			outSampleOffset = nextSampleOffset;
		});
	}

	return [leftChannelBuffer, rightChannelBuffer];
}

/*
===============================================   TYPEWRITER   ===============================================
*/



function writeText() {
	var timeBetweenLetters = 50
	var timeBetweenPhrases = 2000

	if (message.letter == 0) {
		bottomTextText = ""
	}

	//if there is a phrase to write
	if (message.message[message.phrase]) {
		//if letters still need to be written
		if (message.letter < message.message[message.phrase].length) {
			animateMouth = true
			if (state == "game" || state == "menu") zzfx(...[effectVolume / 4, , 523.2511, .01, , .01, , .51, -5.2, 8.4, 469, .25, , , , , , .43, .04]); // Blip 223
			//write letter
			bottomTextText += message.message[message.phrase][message.letter]
			message.letter += 1
			message.timeout = window.setTimeout(writeText, timeBetweenLetters)
		} else {
			animateMouth = false
			//finished current phrase
			//if there is a phrase next+
			if (message.message[message.phrase + 1]) {
				//go to next phrase
				message.letter = 0
				message.phrase += 1
				message.timeout = setTimeout(writeText, timeBetweenPhrases)
			} else {
				//if phrases are finished
				if (message.stayOnEnd == true) {
					//message has to stay on end?
					message.phrase = 0
					message.letter = 0
					clearTimeout(message.timeout)
				} else {
					//message has to disappear on end
					message.letter = 0
					message.phrase += 1
					message.timeout = setTimeout(writeText, message.timeToDisappear)
				}
			}
		}
	} else {
		//there is no phrase to write
		bottomTextText = ""
	}

}

function setMessage(_message, _stay) {
	message.stayOnEnd = _stay
	bottomTextText = ""
	message.timeToDisappear = 2000
	clearTimeout(message.timeout)
	message.message = _message
	message.restart()
}



function writeStoryMessage() {
	var timeBetweenLetters = 50
	var timeBetweenPhrases = 50

	//if there is a phrase to write
	if (storyMessage.fullMessage[storyMessage.phrase]) {
		//if letters still need to be written
		if (storyMessage.letter < storyMessage.fullMessage[storyMessage.phrase].length) {
			zzfx(...[effectVolume / 4, , 523.2511, .01, , .01, , .51, -5.2, 8.4, 469, .25, , , , , , .43, .04]); // Blip 223
			//write letter
			if (storyMessage.message[storyMessage.phrase] == undefined) {
				storyMessage.message[storyMessage.phrase] = []
			}
			storyMessage.message[storyMessage.phrase] += storyMessage.fullMessage[storyMessage.phrase][storyMessage.letter]
			storyMessage.letter += 1
			storyMessage.timeout = window.setTimeout(writeStoryMessage, timeBetweenLetters)
		} else {
			//finished current phrase
			//if there is a phrase next+
			if (storyMessage.fullMessage[storyMessage.phrase + 1]) {
				//go to next phrase
				storyMessage.letter = 0
				storyMessage.phrase += 1
				storyMessage.timeout = setTimeout(writeStoryMessage, timeBetweenPhrases)
			} else {
				//message has to stay on end?
				storyMessage.phrase = 0
				storyMessage.letter = 0
				clearTimeout(storyMessage.timeout)
			}
		}
	} else {
		//there is no phrase to write
		storyText = ""
	}

}


function setStoryMessage(_message) {
	clearTimeout(storyMessage.timeout)
	storyMessage.fullMessage = _message
	storyMessage.message = [""]
	storyMessage.restart()
}



/*
===============================================   WINDOW FOCUS HANDLER   ===============================================
*/

function windowFocus() {
	if (music != null && muted == false) {
		music.resume()
	}
}

function windowUnfocus() {
	if (music != null) {
		music.suspend()
	}
}


/*
===============================================   FULLSCREEN HANDLER   ===============================================
*/

function toggleFullscreen() {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
}


/*
===============================================   SETUP LISTENERS AND START GAME   ===============================================
*/


//this = window

this.onmousedown = mouseDown;
this.onmouseup = mouseUp;
this.onmousemove = mouseMove;

this.addEventListener('touchstart', touchstart, {
	passive: false
});
this.addEventListener('touchend', touchend, {
	passive: false
});
this.addEventListener('touchmove', touchmove, {
	passive: false
});

this.addEventListener("focus", windowFocus, false);
this.addEventListener("blur", windowUnfocus, false);



//createLevel()

setMessage(["Click to start!"], true)


setStartingColors()
setLoadingColor()

//RESET GAME for testing purposes
/*
saveData("storyState", "0")
saveData("polyLeft", 13)
saveData("showTutorial", "true")
*/

update()