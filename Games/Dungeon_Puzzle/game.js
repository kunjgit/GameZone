
/* INI DEBUG */
let debugStats = { begin(){}, end(){} }
const scriptEl = document.createElement('script')
scriptEl.onload = ()=> {
  debugStats = Stats ? new Stats() : {
    dom: document.createElement('button'),
    begin() { },
    end() { },
  }
  document.body.appendChild(debugStats.dom)
}
scriptEl.src = 'https://cdn.jsdelivr.net/gh/mrdoob/stats.js@master/build/stats.js'
document.body.appendChild(scriptEl)
/* END DEBUG */

const vecTo = (p1, p2)=> ({
  x: p2.x - p1.x,
  y: p2.y - p1.y
})

const vecSize = (vec)=> Math.sqrt(vec.x**2 + vec.y**2)

const vecOne = (vec, multplier=1)=> {
  const d = vecSize(vec)
  return {
    x: multplier * vec.x/d,
    y: multplier * vec.y/d
  }
}

window.forceGraphicUp = ()=> {
  log('Force graphics upgrade.')
  body.classList.remove('slow')
  upgradedGraphcsTime = Date.now()
  shouldDowngradeGraphics = 0
}

let isActCraven = false
let isActDeffen = true
let isActAggres = false
let allMapEntities = []
let hadAHitThisTurn = false
let lastTime = Infinity
let ticCounter = 0
let shouldDowngradeGraphics = 0
let shouldUpgradeGraphics = 0
let upgradedGraphcsTime = 0
const tic = ()=> {
  debugStats.begin() // DEBUG
  if (gameIsOn) setTimeout(tic, 66)

  ticCounter++
  if (ticCounter%8 === 0) {
    const now = Date.now()
    const frameDelay = (now - lastTime) / 8
    lastTime = now
    if (frameDelay > 142 /* 6.999- FPS */) {
      console.log('FPS is low:', 1000/frameDelay)
      if (upgradedGraphcsTime < (now-10_000) && realStartTime < (now-40_000)) {
        $('#forceGraphBtn').classList.remove('show')
        shouldDowngradeGraphics++
        if (shouldDowngradeGraphics > 3) {
          body.classList.add('slow')
          shouldUpgradeGraphics = 0
        }
      }
    }
    if (frameDelay < 70 /* 14.285+ FPS */) {
      if (++shouldUpgradeGraphics > 10) {
        $('#forceGraphBtn').classList.add('show')
      }
    }
  }

  isActCraven = act === 'cra'
  isActDeffen = act === 'def'
  isActAggres = act === 'agg'

  for (let el,i=0; el=mapBoids.heroes[i]; i++) {
    el.tic++
    heroTic(el)
  }
  if (!frozen) for (let el,i=0; el=mapBoids.enemies[i]; i++) {
    el.tic++
    enemyTic(el)
  }
  updateFireballs()
  allMapEntities = [...mapBoids.heroes, ...mapBoids.enemies]
  for (let el,i=0; el=allMapEntities[i]; i++) if (!frozen || el.isHero) {
    randomizeAndLimitVelocity(el)
    testColision(el)
    testColisionWall(el)
    if (el.life > 0) {
      // Slow down big enemies:
      if (el.size > 6) { el.v.x /= 2; el.v.y /= 2 }
      // Prevent "NaN stop el" bug:
      if (!el.v.x) el.v.x = 0
      if (!el.v.y) el.v.y = 0
      // Move it!
      el.x += el.v.x
      el.y += el.v.y
      if (el.x < 0 ||
          el.y < 0 ||
          el.x > puzzleWidth*5 ||
          el.y > puzzleHeight*5) hitEntity(el)
      el.onupdate()
    }
  }
  if (hadAHitThisTurn) playTone(600, 0, 1, .5, 200)
  hadAHitThisTurn = false
  //queueMicrotask(()=>log('=====================================================')) // DEBUG
  debugStats.end() // DEBUG
}

const nearestEntity = (from, mapEntities, actDist=10)=> {
  let nearestElDist, nearestEl, vec2El
  for (let el,i=0; el=mapEntities[i]; i++) {
    if (abs(el.x-from.x)<actDist && abs(el.y-from.y)<actDist) {
      let newVec2El = vecTo(from, el)
      let newDist = vecSize(newVec2El)
      if (nearestElDist) {
        if (newDist < nearestElDist) {
          nearestElDist = newDist
          nearestEl = el
          vec2El = newVec2El
        }
      } else {
        nearestElDist = newDist
        nearestEl = el
        vec2El = newVec2El
      }
    }
  }
  return [vec2El, nearestElDist, nearestEl]
}

const enemyTic = (enemy)=> {
  // Die by ageing:
  // if (enemy.tic > 10 && enemy.lifeOrig===1 && rnd()<.3) hitEntity(enemy)
  const actDist = enemy===bossEl ? 3 : (enemy.size > 6) ? 6 : 15
  const [vec2Hero] = nearestEntity(enemy, mapBoids.heroes, actDist)
  if (vec2Hero) {
    let velocity2Target = vecOne(vec2Hero, .03)
    enemy.v.x += velocity2Target.x
    enemy.v.y += velocity2Target.y
  } else {
    if (enemy===bossEl) {
      let vec2Throne = vecTo(enemy, {
        x: (puzzleWidth-1)*5 + 1.5,
        y: (puzzleHeight-1)*5 + 1.5
      })
      let velocity2Target = vecOne(vec2Throne, .03)
      enemy.v.x += velocity2Target.x
      enemy.v.y += velocity2Target.y
    } else {
      enemy.v.x *= .8
      enemy.v.y *= .8
    }
  }
}

const heroTic = (el)=> {
  const [vec2Enemy, dist, enemy] = nearestEntity(el, mapBoids.enemies, 10)
  const hasWill = (el.tagName==='M')
                ? wizardTic(el, vec2Enemy, dist, enemy)
                : warriorTic(/* useless placeholder */)
  if (!hasWill) {
    if (vec2Enemy && dist < 8) {
      const velInc = vecOne(vec2Enemy, .05)
      if (isActCraven) {
        el.v.x -= velInc.x
        el.v.y -= velInc.y
      }
      if (isActAggres) {
        el.v.x += velInc.x
        el.v.y += velInc.y
      }
    }
    let vec2Target = vecTo(el, boidTarget)
    let velocity2Target = vecOne(vec2Target, .03)
    if (vecSize(vec2Target) > 2) {
      el.v.x += velocity2Target.x
      el.v.y += velocity2Target.y
    } else {
      el.v.x += velocity2Target.x/5
      el.v.y += velocity2Target.y/5
    }
  }
}

const warriorTic = (warrior)=> {
  // Nothing to do.
}

const wizardTic = (wizard, vec2Enemy, dist, enemy)=> {
  let will = false
  if (vec2Enemy) {
    if (dist < 2) {
      const velInc = vecOne(vec2Enemy, .03)
      wizard.v.x -= velInc.x
      wizard.v.y -= velInc.y
      will = true
    }
    if (wizard.tic % 50 === 0) mkFireball(wizard, enemy)
  }
  return will
}

const mkFireball = (wizard, target)=> {
  const fireball = mkEl('fb', {
    parent: walkersLayerEl,
    onupdate() {
      this.style.left = (this.x+.4) + 'em'
      this.style.top  = (this.y+.4) + 'em'
    }
  })
  fireball.target = target
  fireball.x = wizard.x
  fireball.y = wizard.y
  fireballs.push(fireball)
  fireball.onupdate()
  return fireball
}

const updateFireballs = ()=> {
  for (let fb,i=0; fb=fireballs[i]; i++) {
    let vec2Target = vecTo(fb, fb.target)
    let velocity2Target = vecOne(vec2Target, .3)
    fb.style.setProperty('--dx', -velocity2Target.x*.7+'em')
    fb.style.setProperty('--dy', -velocity2Target.y*.7+'em')
    fb.x += velocity2Target.x
    fb.y += velocity2Target.y
    // Test wall colision
    for (let wall,i=0; wall=mapWalls[i]; i++) if (wall.r < 3) {
      let vec2Wall = vecTo(fb, wall)
      if (vecSize(vec2Wall) < wall.r*1.2) explodeFireball(fb)
    }
    // Test target colision
    let dist = vecSize(vec2Target)
    if (dist < (fb.target.r + .3)) {
      explodeFireball(fb)
      hitEntity(fb.target)
    }
    fb.onupdate()
  }
}

const explodeFireball = (fb)=> {
  fireballs = fireballs.filter(fb2 => fb2 !== fb)
  fb.classList.add('boom')
  setTimeout(()=> fb.remove(), 2000)
}

const randomizeAndLimitVelocity = (el)=> {
  if (el!==bossEl) {
    el.v.x += rnd(.06)-.03
    el.v.y += rnd(.06)-.03
  }
  let vel = vecSize(el.v)
  if (vel > .1) el.v = vecOne(el.v, .1)
}

const testColision = (el1)=> {
  for (let el2,i=0; el2=allMapEntities[i]; i++) if (el1 !== el2) {
    let vec = vecTo(el1, el2)
    let dist = vecSize(vec)
    let minDist = el1.r + el2.r
    if (areEnemies(el1, el2)) {
      if (dist < minDist) {
        //log(el1.id,'hit',el2.id)
        hitEntity(el2)
      }
    } else { // Friends
      if (dist < minDist*1.5) {
        vec = vecOne(vec, .01)
        el1.v.x -= vec.x
        el1.v.y -= vec.y
      }
    }
    if (dist < minDist) {
      vec = vecOne(vec, .03)
      el1.v.x = -vec.x
      el1.v.y = -vec.y
    }
  }
}

const testColisionWall = (el)=> {
  for (let wall,i=0; wall=mapWalls[i]; i++) {
    let vec = vecTo(el, wall)
    let dist = vecSize(vec)
    let minDist = el.r + wall.r
    if (dist < minDist*1.4) {
      vec = vecOne(vec, .06)
      let dx = abs(el.x - wall.x)
      let dy = abs(el.y - wall.y)
      if (dx > dy && dx < minDist) el.v.x = -vec.x
      if (dy > dx && dy < minDist) el.v.y = -vec.y
    }
  }
}

const castMagicRegenerate = ()=> {
  const wizards = mapBoids.heroes.filter(el => el.tagName==='M' )
  if (wizards.length === 0) {
    notify('You have no wizards.')
    return false
  }
  let regenerations = 0
  wizards.map((wizard)=> {
    log(wizard.id + ' cast Regen...')
    wizard.classList.add('cast-rgn')
    setTimeout(()=> wizard.classList.remove('cast-rgn'), 2000)
    mapBoids.heroes.map((el)=> {
      const dist = vecSize(vecTo(wizard, el))
      if (dist < 4 && el.life < el.lifeOrig) {
        log('Regen!', el.id, el.life)
        el.life++
        updateLifeDisplay(el)
        regenerations++
      }
    })
  })
  if (regenerations === 0) delayedNotify(1, 'No hero regenerated.')
  else if (regenerations === 1) delayedNotify(1, 'One hero regenerated.')
  else delayedNotify(1, regenerations+' heroes regenerated.')
  return true
}

const castMagicFreeze = ()=> {
  const wizards = mapBoids.heroes.filter(el => el.tagName==='M' )
  if (wizards.length === 0) {
    notify('You have no wizards.')
    return false
  }
  frozen = true
  tableEl.classList.add('frozen')
  setTimeout(()=> {
    frozen = false
    tableEl.classList.remove('frozen')
  }, 5000)
  return true
}

const areEnemies = (el1, el2)=> {
  const els = [el1.tagName, el2.tagName].sort().join('')
  return els === 'EU' || els === 'EM'
}

const hitEntity = (el)=> {
  if (el.life <= 0) return;
  hadAHitThisTurn = true
  el.life--
  updateLifeDisplay(el)
  //log(el.id, 'Bleed', el.className, el.life)
  if (el.life <= 0) justKill(el, true)
}

const updateLifeDisplay = (el)=> {
  el.className = el.className.replace(
    /life./,
    `life${(el.life <= 0) ? 0 : ~~(el.life*5/el.lifeOrig)+1}`
  )
}

const justKill = (el, giveGold)=> {
  el.life = 0
  updateLifeDisplay(el)
  //queueMicrotask(()=> log('DEAD:', el.id, el.x.toFixed(2), el.y.toFixed(2))) // DEBUG
  queueMicrotask(()=> mapBoids[el.group] = mapBoids[el.group].filter(el2 => el2 !== el))
  setTimeout(()=> el.parentNode && el.remove(), 40_000)
  if (el.tagName === 'E' && giveGold) addGold(el.lifeOrig, true)
  if (el === bossEl) killBoss()
}

const killBoss = ()=> {
  bossKilled = true
  notify('The Lord of Death has vanished, now all undead slaves will dismantle in the ground.')
  let t = 0
  mapBoids.enemies.map(el => {
    if (el.life) setTimeout(()=> justKill(el), ++t*333)
  })
  setTimeout(youWin, t*333+2000)
}

const youWin = ()=> {
  if (!gameIsOn) return;

  // Music:
  const base = 660
  const inc = 100
  for (let t=0; t<3; t+=1.1) {
    for (let n=0; n<3; n++) {
      playTone(base+(t+n)*inc,     t+n*.175, 1.0, .25)
      playTone((base+(t+n)*inc)*5, t+n*.175, 0.2, .25)
    }
    playTone(base+(t+4)*inc,     t+.525, 1.0, .8+t/4)
    playTone((base+(t+4)*inc)*5, t+.525, 0.2, .8+t/4)
  }

  const elapsedTime = Date.now() - realStartTime
  const minutes = ~~(elapsedTime / 60_000)
  const seconds = ~~((elapsedTime - minutes*60_000) / 1000)
  const notification = notify('Celebrate! You Win!', { noRemove:1, top:5, class:'win' })
  const tweet = escape(
    `I took ${minutes} minutes and ${seconds} seconds to finish the Dungeon Puzzle,` +
    ` on ${gameLevel} mode! https://js13kgames.com/entries/dungeon-puzzle` +
    ` #js13k`
  )
  notification.innerHTML += `<br>
  <a target="_blank" href="https://twitter.com/intent/tweet?text=${tweet}">Share with your friends <b>🐦</b></a>
  `
  gameEnded()
}

// Will be called by the clock after 13 munutes.
const gameTimeout = ()=> {
  gameOver('Your time is over.')
  playAlarm()
}

const gameOver = (message)=> {
  if (!gameIsOn) return;
  notify(message)
  body.classList.add('gameover')
  allMapEntities.map(el => {
    el.style.transition = (1+rnd())+'s'
    el.style.transform = `translate(${rnd(4)-2}em,${rnd(4)-2}em)`
  })
  $$('article p').map(piece => {
    piece.style.transition = (1+rnd())+'s'
    piece.style.transform = `translate(${rnd(.4)-.2}em,${rnd(.4)-.2}em) rotate(${rnd(.4)-.2}turn)`
  })
  gameEnded()
}

const gameEnded = ()=> {
  gameIsOn = false
  $('ctrl').style.pointerEvents = 'none'
  $('article').style.pointerEvents = 'none'
}

window.giveUp = ()=> {
  if (confirm('Are you sure?')) gameOver('I give up!')
}

const addGold = (coins=0, playSound)=> {
  if (playSound) for (let i=0; i<4; i++) {
    playTone(2000, .5 + i/20, .6, .5)
    playTone(8000, .5 + i/20, .1, .5)
  }
  gold += coins
  $('gold').innerHTML = `<b>🪙</b> ${gold} coins`
}
// Let the player to sheet
console.log('Hi smart user, you can run %c addGold(<num>) %c and buy more pieces.', 'background:#000;color:#FFF', '')
window.addGold = addGold

function getNeighbors(x, y) {
  return {
    N: (placedPieces[y-1]||[])[x],
    S: (placedPieces[y+1]||[])[x],
    E: (placedPieces[y]||[])[x+1],
    W: (placedPieces[y]||[])[x-1]
  }
}

/**
 * Can the player place the piece in this (x,y) table title?
 */
let canPieceFitError = ''
function canPieceFit(piece, x, y) {
  canPieceFitError = ''
  if (typeof(x)==='undefined' || typeof(y)==='undefined') return false
  if ((placedPieces[y]||[])[x]) return false
  const neighbors = getNeighbors(x, y)

  canPieceFitError = 'Piece side must be flat to fit the puzle border.'
  if (x === 0 && piece.W !== '-') return false
  if (x === puzzleWidth-1 && piece.E !== '-') return false
  if (y === 0 && piece.N !== '-') return false
  if (y === puzzleHeight-1 && piece.S !== '-') return false

  canPieceFitError = 'A flat side must not be faced inside the puzzle.'
  if (x > 0 && piece.W === '-') return false
  if (x < puzzleWidth-1 && piece.E === '-') return false
  if (y > 0 && piece.N === '-') return false
  if (y < puzzleHeight-1 && piece.S === '-') return false

  canPieceFitError = 'This piece can NOT be connected here.'
  if (!canPlugThatTwoPieces(piece, 'S', neighbors.S, 'N')) return false
  if (!canPlugThatTwoPieces(piece, 'N', neighbors.N, 'S')) return false
  if (!canPlugThatTwoPieces(piece, 'E', neighbors.E, 'W')) return false
  if (!canPlugThatTwoPieces(piece, 'W', neighbors.W, 'E')) return false

  const neighborTerrains = trueishValues(neighbors).map(p => p.terrain)
  if (
    (piece.terrain === BUILDING && neighborTerrains.includes(CAVERN)) ||
    (piece.terrain === CAVERN && neighborTerrains.includes(BUILDING))
  ) {
    canPieceFitError = 'You can NOT connect a building to a cavern.'
    return false
  }

  canPieceFitError = ''
  return true
}

/**
 * Piece 1's plug can plug on piece 2's plug?
 * If there is no piece 2, it can freely plug.
 */
function canPlugThatTwoPieces(p1, plug1, p2, plug2) {
  if (p1 && !p2) return true
  return [ p1[plug1], p2[plug2] ].sort().join('') === 'fm'
}
