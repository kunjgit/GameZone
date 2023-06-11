const BUILDING = 'building'
const WOODS = 'woods'
const CAVERN = 'cavern'
const {floor, ceil, max, abs} = Math
const rnd = (mult=1)=> Math.random()*mult
const arrRnd = (arr)=> arr[floor(rnd(arr.length))]
const $ = (sel)=> document.querySelector(sel)
const $$ = (sel)=> [...document.querySelectorAll(sel)]
const showDebug =
      !!document.location.search.match(/debug/) || // DEBUG
      false;

const mapSpaces = []
const placeholders = []
let mapWalls = []
const mapBoids = { heroes: [], enemies: [] }
let fireballs = []
const docRoot = $(':root')
let bossPiece = null
let bossEl = null
let bossKilled = false
let puzzleWidth, puzzleHeight
let rndEnemyChance, bigEnemyProp = .2
let placedPieces

let gameLevel
let gameIsOn = false
let startTime, realStartTime

const body = document.body
const avaliableBox = $('#avaliable')
const tableEl = $('article')
const puzzleLayerEl = $('article > div')
const walkersLayerEl = $('article > ul')

const log = console.log // DEBUG
const trueishValues = (obj)=> Object.values(obj).filter(val => val)

let gold = 0
let act = 'defensive'
let frozen = false
const tableTop = $('article div')

const MAPS = {
  N: [
    [
      '#####',
      '   # ',
      ' # # ',
      ' # # ',
      '   # '
    ], [
      '#####',
      ' #   ',
      ' ### ',
      '   # ',
      '   # '
    ], [
      '#####',
      '#####',
      '   ##',
      '## ##',
      '## ##'
    ], [
      '#####',
      '#   #',
      '    #',
      '#   #',
      '## ##'
    ], [
      '#####',
      '#   #',
      '#   #',
      '#   #',
      '## ##'
    ]
  ],
  S: [
    [
      '   # ',
      ' # # ',
      ' # # ',
      '   # ',
      '#####'
    ], [
      '   # ',
      '   # ',
      ' ### ',
      ' #   ',
      '#####'
    ], [
      '## ##',
      '## ##',
      '   ##',
      '#####',
      '#####'
    ], [
      '## ##',
      '## ##',
      '    #',
      '##  #',
      '#####'
    ]
  ],
  W: [
    [
      '#  ##',
      '#  # ',
      '#  # ',
      '#  # ',
      '#  ##'
    ], [
      '#    ',
      '#####',
      '#    ',
      '#  ##',
      '#  ##'
    ], [
      '#  ##',
      '# ## ',
      '# #  ',
      '# ## ',
      '#  ##'
    ]
  ],
  E: [
    [
      '    #',
      '#####',
      '    #',
      '    #',
      '    #'
    ], [
      '    #',
      '  ###',
      ' ## #',
      '##  #',
      '    #'
    ], [
      '    #',
      '### #',
      '    #',
      '#####',
      '    #'
    ]
  ],
  in: [
    [
      '## ##',
      '#   #',
      '     ',
      '#   #',
      '## ##'
    ], [
      '#####',
      '#   #',
      '     ',
      '#   #',
      '#####'
    ], [
      '## ##',
      '#   #',
      '#   #',
      '#   #',
      '## ##'
    ], [
      '## ##',
      '#   #',
      '    #',
      '#   #',
      '## ##'
    ], [
      '## ##',
      '#  ##',
      '   ##',
      '#  ##',
      '## ##'
    ], [
      '     ',
      '  #  ',
      ' ### ',
      '  #  ',
      '     '
    ], [
      '     ',
      ' # # ',
      '     ',
      ' # # ',
      '     '
    ], [
      '   # ',
      '   # ',
      '   # ',
      '   # ',
      '   # '
    ], [
      ' # # ',
      ' # # ',
      ' # # ',
      ' # # ',
      ' # # '
    ], [
      ' # # ',
      '   # ',
      ' # # ',
      '   # ',
      ' # # '
    ], [
      '   ##',
      ' #  #',
      ' #  #',
      ' #  #',
      '   ##'
    ], [
      '   # ',
      '  ## ',
      '  #  ',
      '  ## ',
      '   # '
    ], [
      '   # ',
      ' ### ',
      ' ##  ',
      ' ### ',
      '   # '
    ], [
      '   # ',
      ' # # ',
      ' # # ',
      ' ### ',
      '   # '
    ], [
      '   # ',
      ' ### ',
      ' # # ',
      ' # # ',
      '   # '
    ], [
      '     ',
      '     ',
      '     ',
      '     ',
      '     '
    ]
  ]
}
