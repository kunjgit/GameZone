const c = document.querySelector('#console')
const gt = document.querySelector('#game_track')
const gp = document.querySelector('#game_player')
const gh = document.querySelector('#grandmas')
const wolf = document.querySelector('#game_wolf')
const sb = document.querySelector('#start_btn')
const road_map = document.querySelector('#road_map')
var goal = 5
var doink = 0
var gt_base = 0
var pits = 0
var time = 1

function jumpPlayer() {
  gp.classList.add('jump')
  setTimeout(function(){
    gp.classList.remove('jump')
  }, 500)
}

c.addEventListener('click', jumpPlayer)

function addPit() {
  var p = document.createElement('div')
  p.className = 'pit'
  p.onanimationend = function(){     
    pits++     
    var perc = Math.round((pits / goal)*100) + '%'
    document.documentElement.style.setProperty('--map', perc)
    this.remove()
  }
  gt.appendChild(p)
}

function checkForFail() {
  if(!document.querySelector('.red_dead')){
    // move background 
    gt_base = gt_base + 7
    gt.style.backgroundPosition = '0 '+ gt_base + 'px'
  }  

  //  check for collison with pit
  var p_loc = gp.getBoundingClientRect()
  var hit = document.elementFromPoint(p_loc.x, p_loc.y + 25)

  if(hit.classList.contains('pit')){
    document.querySelectorAll('.pit')[0].style.pointerEvents = 'none'
    doink++
    // gp.innerHTML = doink
    gp.classList.add('red_dead')
    wolf.classList.add('wolf_wins')
    c.classList.add('stop_animation')
    setTimeout(function(){
      sb.classList.remove('hide_start_btn')

      var pittys = document.querySelectorAll('.pit')
      pittys.forEach(function(elm){ 
        elm.remove() 
      })
    },2000)
  }

  // if goal reached do stuff
  if(pits == goal) {
    gh.classList.add('grandmas')
    var pittys = document.querySelectorAll('.pit')
    pittys.forEach(function(elm){ 
      elm.remove() 
    })

    setTimeout(function(){
      gp.classList.add('got_home')
      setTimeout(function(){
        gp.classList.remove('got_home')
        gp.classList.add('red_wins')
      }, 1100)
    }, 2000)

    setTimeout(function(){
      gp.style.left = '50%'
      gp.style.top = '50%'
      gp.style.zIndex = '300'
      c.classList.add('stop_animation')
      gh.classList.add('home')

      setTimeout(function(){
        wolf.classList.add('dead_wolf')
        setTimeout(function(){
          if(goal < 20) {
            goal = goal + 5
          }          
          sb.classList.remove('hide_start_btn')
        },4000)
      },600)
    }, 3000)

  } 

  if(pits != goal && !document.querySelector('.wolf_wins')) {
    // add pits at set interval
    if(time % (100 - (goal*2)) === 0) {
      addPit()
    }
    time++

    setTimeout(function(){
      checkForFail()
    }, 1000/30)
  }  
}

const trees = ['url("https://contentservice.mc.reyrey.net/image_v1.0.0/?id=18961330-215b-5d16-b299-0fe8ce2d357e&637841750620440664")','url("https://contentservice.mc.reyrey.net/image_v1.0.0/?id=c88557a6-de87-506a-960b-86f5720a38a0&637841750769195913")','url("https://contentservice.mc.reyrey.net/image_v1.0.0/?id=b1a25712-d6ea-5a6e-8f77-9a0e3373fd47&637841795344914686")','url("https://contentservice.mc.reyrey.net/image_v1.0.0/?id=30776d25-8b46-5e5b-a26b-a74f8ee526fa&637841795591014601")']

function addTree() {
  var p = document.createElement('div')
  p.className = 'tree'
  p.style.backgroundImage = trees[Math.floor(Math.random()*trees.length)];
  p.onanimationend = function(){ this.remove() }

  var c_loc = c.getBoundingClientRect()
  var side = Math.random() < .5 ? 'left' : 'right'
  if(side == 'left') {
    var rand = c_loc.x + (c_loc.width*.5) - 260
    p.style.left = 'calc(50% - 160px)'
    p.style.animation = 'tree1 4s ease-in forwards'
  } else {
    var rand = c_loc.width*.5;
    p.style.left = 'calc(50% + 160px)'
    p.style.animation = 'tree2 4s ease-in forwards' 
  }
  p.style.zIndex = '100'
  c.prepend(p)  

  if(!document.querySelector('.stop_animation')) {
    var tree_gap = Math.floor(Math.random()*3*1000)
    setTimeout(function() {
      addTree()
    }, 1000/3)  
  }  
}

var perc = Math.round((1 / goal)*100) + '%'
document.documentElement.style.setProperty('--map-goals', perc)
sb.addEventListener('click', function(){
  sb.classList.add('hide_start_btn')

  c.className = ''
  gp.className = ''
  gp.style = ''
  gh.className = ''
  wolf.style = ''
  wolf.className = ''
  gt.style = ''

  gt_base = 0
  pits = 0
  time = 1

  var perc = Math.round((1 / goal)*100) + '%'
  document.documentElement.style.setProperty('--map-goals', perc)
  document.documentElement.style.setProperty('--map', '0%')

  checkForFail()
  addTree()  
})