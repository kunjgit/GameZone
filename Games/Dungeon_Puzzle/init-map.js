function initMap(level) {

  $('bg').className = 'hide'
  setTimeout(()=> $('bg').style.display = 'none', 4000)
  gameLevel = level

  if (level == 'easy') {
    puzzleWidth = 5
    puzzleHeight = 5
    rndEnemyChance = .1
  } else if (level == 'medium') {
    puzzleWidth = 9
    puzzleHeight = 6
    rndEnemyChance = .15
  } else if (level == 'hard') {
    puzzleWidth = 12
    puzzleHeight = 7
    rndEnemyChance = .2
  } else {
    puzzleWidth = max(5, parseInt($('#conf-width').value) || 13)
    puzzleHeight = max(5, parseInt($('#conf-height').value) || 7)
    rndEnemyChance = parseInt($('#conf-enemy-chance').value)/100 || .1
    gameLevel = `${puzzleWidth}x${puzzleHeight}`
  }

  placedPieces = Array(puzzleHeight).fill(0).map(y => Array(puzzleWidth).fill(0))

  docRoot.style.setProperty('--pW', puzzleWidth)
  docRoot.style.setProperty('--pH', puzzleHeight)
  onWinResize()

  mkPiece('-mf-', 'building',
    '#####'+
    '#mu #'+
    '#uu  '+
    '#   #'+
    '## ##'
  ).placePiece(0, 0)

  // kidnapped wizards
  mkPiece('ff--', 'cavern',
    '#####'+
    '#####'+
    '#    '+
    '#m ##'+
    '#####'
  ).placePiece(0, puzzleHeight-1, false)
  mkPiece('--ff', 'cavern',
    '#####'+
    '## m#'+
    '    #'+
    '#####'+
    '#####'
  ).placePiece(puzzleWidth-1, 0, false)

  // Boss land
  mkPiece('mmmm', 'cavern',
    '## ##'+
    '##3# '+
    ' 3811'+
    '##111'+
    '# 111'
  ).placePiece(puzzleWidth-3, puzzleHeight-3, false)

  mkPiece('m-mm', 'cavern',
    '#222#'+
    '##7 #'+
    '1## #'+
    '11###'+
    '111##'
  ).placePiece(puzzleWidth-1, puzzleHeight-3, false)

  mkPiece('mm-m', 'cavern',
    '##111'+
    '2##11'+
    '27##1'+
    '2  ##'+
    '#####'
  ).placePiece(puzzleWidth-3, puzzleHeight-1, false)

  bossPiece = mkPiece('m--m', 'cavern',
    '    #'+
    ' 9#1#'+
    ' ##1#'+
    ' 111#'+
    '#####'
  ).placePiece(puzzleWidth-1, puzzleHeight-1, false)
  window.bossPiece = bossPiece // DEBUG
  const bossGrid = bossPiece.mkChild('grid')
  const gridWall = []
  const bossOffsetX = (puzzleWidth-1)*5
  const bossOffsetY = (puzzleHeight-1)*5
  for (let x=3.4; x>0; x-=.4)
    gridWall.push(placeWall(bossOffsetX+x, bossOffsetY+.2, .3))
  for (let y=.6; y<3.6; y+=.4)
    gridWall.push(placeWall(bossOffsetX+.2, bossOffsetY+y, .3))
  bossPiece.openGrid = ()=> {
    bossGrid.setStyle({ width: 0, height: 0, top: '1em' })
    gridWall.map((wall, i)=> setTimeout(()=> {
      playTone(60,  .00, 1.0, .1)
      playTone(110, .00, 1.0, .1)
      playTone(200, .00, 0.5, .1)
      playTone(60,  .08, 1.0, .1)
      playTone(110, .08, 1.0, .1)
      playTone(200, .08, 0.5, .1)
      mapWalls = mapWalls.filter(w => w !== wall)
      if (wall.el) wall.el.remove() // DEBUG
    }, (i+2)*170))
  }
  bossPiece.origEnablePiece = bossPiece.enablePiece
  bossPiece.enablePiece = ()=> {
    bossPiece.origEnablePiece()
    bossEl = walkersLayerEl.querySelector('.e9')
    queueMicrotask(()=> {
      for (let i=0; i<9; i++) {
        let x = (i+1)/100 // Add a small move to prevent zero distance colision
        placeEnemy(bossOffsetX+i%3+1, bossOffsetY+3+x, 1)
        placeEnemy(bossOffsetX+3+x, bossOffsetY+i%3+1, 1)
      }
    })
  }

  // Place protection walls. So entities can't escape:
  const halfWidth = puzzleWidth*5/2
  const halfHeight = puzzleHeight*5/2
  /* NORT  */ placeWall(halfWidth-.5, -halfWidth, halfWidth)
  /* SOUTH */ placeWall(halfWidth-.5, halfHeight*2+halfWidth-1, halfWidth)
  /* WEST  */ placeWall(-halfHeight, halfHeight-.5, halfHeight)
  /* EAST  */ placeWall(halfWidth*2+halfHeight-1, halfHeight-.5, halfHeight)
  for (let x=0; x<puzzleWidth; x++) for (let y=0; y<puzzleHeight; y++) {
    if (!placedPieces[y][x]) {
      let placeholderWall = placeWall(x*5+2, y*5+2, 2.5)
      if (!placeholders[y]) placeholders[y] = []
      placeholders[y][x] = placeholderWall
      if (!mapSpaces[y]) mapSpaces[y] = []
      mapSpaces[y][x] = mkEl('space', {
        parent: tableTop,
        onmouseover(ev) { mouseoverTableTile(ev, x, y) },
        css: {
          left: (x*100+5)+'px',
          top:  (y*100+5)+'px'
        }
      })
    }
  }

  initPieceOptions()

  window.sheet = ()=> {
    for (let x=0; x<puzzleWidth; x++) for (let y=0; y<puzzleHeight; y++) {
      if (!placedPieces[y][x]) ((x,y)=> setTimeout(()=> {
        if (x==0) mkRndPiece(3).placePiece(x, y)
        else if (y==0) mkRndPiece(0).placePiece(x, y)
        else if (x==12) mkRndPiece(1).placePiece(x, y)
        else if (y==6) mkRndPiece(2).placePiece(x, y)
        else mkRndPiece(9).placePiece(x, y)
      }, (y*puzzleWidth+x)*300))(x,y)
    }
  }

  delayedNotify(10, `The Lord of Death's dungeon is southeastern corner of unknown lands.`,
               {iniTop: 90, top: 48, dur: 10})
  delayedNotify(11, 'You will recognize the Lord of Death by their emerald crown.',
               {iniTop: 90, top: 55, dur: 11})
  delayedNotify(12, `Don't confuse him with your generals, who wear a onyx crown.`,
               {iniTop: 90, top: 62, dur: 12})
  delayedNotify(13, `Nor with his son, who wear the silver crown.`,
               {iniTop: 90, top: 69, dur: 13})
  delayedNotify(14, 'Kill the Lord of Death and all undead will vanish with him.',
               {iniTop: 90, top: 76, dur: 14})

  delayedNotify(50, 'The woods told two more wizards are kidnapped!',
               {iniTop: 90, top: 50, dur: 9})
  delayedNotify(52, 'You can find they on the other edges of unknown lands.',
               {iniTop: 90, top: 57, dur: 9})

  gameIsOn = true
  addGold(199 + ~~(puzzleWidth*puzzleHeight/20)*50)
  initAudio()
  startClock()
  tic()
}

function initPieceOptions() {
  for (let x=0; x<2; x++) for (let y=0; y<5; y++) {
    let terrain = (y<2) ? BUILDING
                : (x<1) ? WOODS : CAVERN
    let p = mkRndPiece(
      -1,
      (  y==0 )
      ? `-${rndPlug()}${rndPlug()}f`
      : ( y==1 )
      ? `m${rndPlug()}${rndPlug()}-`
      : '',
      terrain
    )
    configPieceOption(p, x, y)
  }
}

function configPieceOption(p, x, y) {
  p.x = x
  p.y = y
  p.drag = (mouseX=0, mouseY=0)=> {
    const srcBox = avaliableBox.getBoundingClientRect()
    p.style.left = (mouseX ? mouseX-50-srcBox.x : 100*p.x) + 'px'
    p.style.top  = (mouseY ? mouseY-50-srcBox.y : 90*p.y) + 'px'
  }
  p.drag()
  p.addEventListener('mousedown', initDragAvaliablePiece)
  avaliableBox.appendChild(p)
  p.btRotate = mkEl('button', {
    text: '⭯',
    title: 'Rotate',
    parent: p,
    class: 'hide',
    onmousedown(ev) { ev.stopPropagation() },
    onclick(ev) { ev.stopPropagation(); rotateAvaliable(p, x, y) }
  })
  p.btReplace = mkEl('button', {
    text: '⇆',
    title: 'Replace',
    parent: p,
    class: 'hide replace',
    onmousedown(ev) { ev.stopPropagation() },
    onclick(ev) { ev.stopPropagation(); replaceAvaliable(p, x, y) }
  })
  const optMouseOver = ()=> {
    p.btRotate.classList.remove('hide')
    p.btReplace.classList.remove('hide')
  }
  const optMouseOut = ()=> {
    p.btRotate.classList.add('hide')
    p.btReplace.classList.add('hide')
  }
  p.addEventListener('mouseover', optMouseOver)
  p.addEventListener('mouseout', optMouseOut)
  p.removeOptBtns = ()=> {
    p.btRotate.remove()
    p.btReplace.remove()
    p.removeEventListener('mouseover', optMouseOver)
    p.removeEventListener('mouseout', optMouseOut)
  }
}
