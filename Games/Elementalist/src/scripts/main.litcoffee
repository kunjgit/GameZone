Since the game is largely based on the tiles appearing randomly, we're going to
need a few basic functions to help with that.

    random = (min, max) ->
      Math.floor(min + Math.random() * (max - min + 1))

    pick = (choices) ->
      choices[random(0, choices.length - 1)]

Being able to merge objects can also be useful.

    merge = (obj, sources...) ->
      obj[key] = value for own key, value of src for src in sources
      obj

Two helpers to get the column (x) and the row (y) of a tile with its index...

    getColumn = (index, columns) ->
      index % columns

    getRow = (index, columns) ->
      Math.floor(index / columns)

... and their inverse.

    getIndex = (x, y, columns) ->
      y * columns + x

The functions checking for matches will look for matches within the current
column **or** row.
The alogrithm to check for a match is as follow: we count matches until there
aren't anymore or we've encountered the end (or beginning) of the line, and we
do this backwards and forwards the given tile. It will return `true` if we have
three or more same tiles.

    horizontalMatch = (board, index, columns) ->
      sum = 0
      length = board.length
      x = getColumn(index, columns)
      y = getRow(index, columns)

      start = x - 1
      if 0 <= start < columns then for i in [start..0]
        break unless board[y * columns + i] == board[index]
        sum += 1

      start = x + 1
      if 0 <= start < columns then for i in [start...columns]
        break unless y * columns + start < length
        break unless board[y * columns + i] == board[index]
        sum += 1
      sum >= 2

    verticalMatch = (board, index, columns, rows) ->
      sum = 0
      length = board.length
      x = getColumn(index, columns)
      y = getRow(index, columns)

      start = y - 1
      if 0 <= y < rows then for i in [start..0]
        break unless board[i * columns + x] == board[index]
        sum += 1

      start = y + 1
      if 0 <= y < rows then for i in [start...rows]
        break unless start * columns + x < length
        break unless board[i * columns + x] == board[index]
        sum += 1
      sum >= 2

    match = (board, index, columns, rows) ->
      horizontal = horizontalMatch(board, index, columns)
      vertical = verticalMatch(board, index, columns, rows)
      horizontal or vertical

It would also be useful to check if a tile is adjacent to another, for example
to make sure that we aren't trying to switch a tile from the first row and one
from the last.
Also, the tricky part here is that we don't want diagonal matches.

    areAdjacents = (tile1, tile2, columns) ->
      x1 = getColumn(tile1, columns)
      y1 = getRow(tile1, columns)
      x2 = getColumn(tile2, columns)
      y2 = getRow(tile2, columns)

      return false unless x1 in [x2 - 1..x2 + 1]
      return false unless y1 in [y2 - 1..y2 + 1]
      return false if x1 != x2 and y1 != y2
      true

Drawing the board is as simple as iterating through all the tiles contained in
the board array. We just need to take care of drawing it **where** we want to
(offsets) and **how** (tile size) we want to.

    drawBoard = (board, columns, ctx, tileW, tileH, textures, options) ->
      for i in [0...board.length]
        drawTile(
          ctx, i, columns, tileW, tileH, textures[board[i]] ? '#000', options
        )

    drawSelectedTile = (ctx, columns, width, height, tile, options) ->
      if tile?
        drawTile(ctx, tile, columns, width, height, SELECTION_COLOR, options)

    drawTile = (ctx, index, columns, width, height, color, options) ->
      {borderColor, borderSize, offsetX, offsetY} = options
      x = offsetX + getColumn(index, columns) * width
      y = offsetY + getRow(index, columns) * height

      fillRect(ctx, x, y, width, height, color)
      strokeRect(ctx, x, y, width, height, borderColor, borderSize)

    fillRect = (ctx, x, y, width, height, color) ->
      ctx.fillStyle = color
      ctx.fillRect(x, y, width, height)

    strokeRect = (ctx, x, y, width, height, color, size) ->
      ctx.lineWidth = size
      ctx.strokeStyle = color
      ctx.strokeRect(x, y, width, height)

    drawProgressBar = (ctx, value, max, x, y, width, height, color, options) ->
      {backgroundColor, borderColor, borderSize} = options
      fill = value / max

      fillRect(ctx, x, y, width, height, backgroundColor)
      fillRect(ctx, x, y, fill * width, height, color)
      strokeRect(ctx, x, y, width, height, borderColor, borderSize)


    drawBars = (ctx, bars, width, height, options) ->
      {offsetX, offsetY} = options

      for bar, i in bars
        {current, max, color} = bar
        x = offsetX
        y = offsetY + i * height
        fill = bar.current / bar.max

        drawProgressBar(
          ctx, current, max, x, y, width, height, color, options
        )

    drawText = (ctx, text, x, y, color, options) ->
      {align, baseline, font} = options

      ctx.fillStyle = color
      ctx.font = font
      ctx.textAlign = align
      ctx.textBaseLine = baseline
      ctx.fillText(text, x, y)


    getLastBest = ->
      localStorage?.getItem('lastBestLvl') ? 0

    setLastBest = (lvl) ->
      localStorage?.setItem('lastBestLvl', lvl)

The constants of the game speak mainly for themselves.
We start by defining the size of the game screen and the targeted FPS.

    RATIO = 2
    CANVAS_WIDTH = 320 * RATIO
    CANVAS_HEIGHT = 480 * RATIO
    BACKGROUND_COLOR = '#fff'
    FPS = 60

The next ones or more specific to the game's representation.

    ROWS = 10
    COLUMNS = 8
    TILE_WIDTH = CANVAS_WIDTH / 10
    TILE_HEIGHT = TILE_WIDTH
    BOARD_OFFSET_X = TILE_WIDTH
    BOARD_OFFSET_Y = TILE_HEIGHT * 4

    TILE_BORDER_SIZE = 4
    TILE_BORDER_COLOR = '#fff'
    TEXTURES = ['#ddd', '#855', '#f55', '#69f']

    BAR_WIDTH = TILE_WIDTH * 8
    BAR_HEIGHT = TILE_HEIGHT / 2
    BAR_BACKGROUND_COLOR = '#eee'
    BAR_BORDER_SIZE = 4
    BAR_BORDER_COLOR = '#fff'
    BARS_OFFSET_X = TILE_WIDTH
    BARS_OFFSET_Y = TILE_HEIGHT * 2.5

    GAME_TEXT_COLOR = '#444'
    WINDOW_TEXT_COLOR = '#ddd'

    SELECTION_COLOR = 'rgba(0,0,0,0.5)'
    WINDOW_COLOR = 'rgba(4,4,4,0.9)'

And finally the data the game will rely on for its logic.

    TILES = [AIR, EARTH, FIRE, WATER] = [0...4]
    NEXT_LVL_BASE = 120
    BASE_POINTS = 2
    BASE_BONUS_MODIFIER = 2
    BASE_TIMER = 20000
    TIMER_MODIFIER = 1.1

The game is displayed on a `Canvas Element` of the width and height specified by
the constants defined earlier. We also need to attach it to the document to make
it visible.

    canvas = document.createElement('canvas')
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    ctx = canvas.getContext('2d')
    canvasRect = null

    document.body.appendChild(canvas)

Generating the board, we also store how we want to render the board (offsets and
tile size) instead of feeding it each time to the `drawBoard` function as an
object literal.

The board is going to be represented as a one-dimensional array of tiles. The
generation takes care of not putting tiles that match together; it's left to the
player to do that!

    generateBoard = (columns, rows, tiles) ->
      size = columns * rows
      board = []
      for i in [0...size]
        loop
          board[i] = pick(tiles)
          break unless match(board, i, columns, rows)
      board

==================================================

    running = no
    gameOver = off

    timer = null
    exp = null
    currentLvl = 0
    points = 0
    bonus = 0
    lastBestLvl = 0

Switching tiles always involves two tiles.

    tile1 = null
    tile2 = null

    switchTiles = (board, first, second) ->
      [board[first], board[second]] = [board[second], board[first]]

    reset = ->
      timer =
        color: '#2a8'
        current: BASE_TIMER
        max: BASE_TIMER
      exp =
        color: '#f95'
        current: 0
        max: NEXT_LVL_BASE
      currentLvl = 1
      points = BASE_POINTS
      bonus = BASE_BONUS_MODIFIER
      lastBestLvl = getLastBest()
      gameOver = off

We watch for click events on the canvas to switch tiles. We have be careful not
to switch tiles that shouldn't, so we need to check a few things:
- is the click even on a tile?
- do we have two tiles?
- are the two tiles adjacents?
- do they even match?

    canvas.addEventListener('click', (e) ->
      canvasRect ?= canvas.getBoundingClientRect()
      clickX = e.clientX - canvasRect.left
      clickY = e.clientY - canvasRect.top

      if not running
        running = yes
        reset()
        return

      x = Math.floor((clickX - BOARD_OFFSET_X) / TILE_WIDTH)
      y = Math.floor((clickY - BOARD_OFFSET_Y) / TILE_HEIGHT)

      return unless 0 <= x < COLUMNS
      return unless 0 <= y < ROWS
      index = getIndex(x, y, COLUMNS)

      if tile1 is null then tile1 = index
      else tile2 = index

      return unless tile1? and tile2?
      if areAdjacents(tile1, tile2, COLUMNS)
        switchTiles(board, tile1, tile2)
        first = match(board, tile1, COLUMNS, ROWS)
        second = match(board, tile2, COLUMNS, ROWS)

        # We switch back if there are no matches
        switchTiles(board, tile1, tile2) unless first or second
      tile1 = tile2 = null
    )

Tiles that were matched are erased from the board, so we need new tiles to take
their place and that's what this function is about. The check for 'matched'
tiles is from bottom to top, and we make the tiles from the top come down, like
a waterfall would.

    bringDown = (board, columns, rows, tiles) ->
      for i in [board.length - 1..0]
        continue unless board[i] is null

        x = getColumn(i, columns)
        y = getRow(i, columns)
        next = (y - 1) * columns + x
        if 0 <= next < board.length
          switchTiles(board, i, next)
      for i in [0...board.length]
        if board[i] is null
          board[i] = pick(tiles)


    getExp = (tiles, points, bonus) ->
      total = points * 3
      total += (tiles.length - 3) * bonus if tiles.length - 3 >= 0
      total

There are two bars: one that represents the timer and one that shows how much
experience until the next level.

    barsRenderOpts =
      backgroundColor: BAR_BACKGROUND_COLOR
      borderColor: BAR_BORDER_COLOR
      borderSize: BAR_BORDER_SIZE
      offsetX: BARS_OFFSET_X
      offsetY: BARS_OFFSET_Y

Let's generate the board and store a few values for the rendering.

    board = generateBoard(COLUMNS, ROWS, TILES)
    boardRenderOpts =
      borderColor: TILE_BORDER_COLOR
      borderSize: TILE_BORDER_SIZE
      offsetX: BOARD_OFFSET_X
      offsetY: BOARD_OFFSET_Y

    reset()

    update = (dt) ->
      return unless running is yes

      timer.current -= 1000 * dt
      if timer.current <= 0
        timer.current = 0
        running = off
        gameOver = true
        setLastBest(currentLvl) if currentLvl > getLastBest()
        return

      matches = []
      for i in [0...board.length]
        matches.push i if match(board, i, COLUMNS, ROWS)
      board[i] = null for i in matches
      return unless matches.length > 0

      exp.current += getExp(matches, points, bonus)
      # Lvl up! \o/
      if exp.current >= exp.max
        exp.current = 0
        points *= currentLvl
        bonus += 1
        currentLvl += 1
        exp.max *= currentLvl
        timer.current = timer.max = timer.max * TIMER_MODIFIER

      bringDown(board, COLUMNS, ROWS, TILES)

    render = ->
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      fillRect(ctx, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, BACKGROUND_COLOR)

      drawBars(ctx, [timer, exp], BAR_WIDTH, BAR_HEIGHT, barsRenderOpts)
      drawBoard(
        board, COLUMNS, ctx, TILE_WIDTH, TILE_HEIGHT, TEXTURES, boardRenderOpts
      )
      drawSelectedTile(
        ctx, COLUMNS, TILE_WIDTH, TILE_HEIGHT, tile1, boardRenderOpts
      )

      if not running
        fillRect(ctx,
          BOARD_OFFSET_X,
          BOARD_OFFSET_Y,
          COLUMNS * TILE_WIDTH,
          ROWS * TILE_HEIGHT,
          WINDOW_COLOR
        )
        drawText(ctx, 'Click to start',
          TILE_WIDTH * 1.2,
          TILE_HEIGHT * 8,
          WINDOW_TEXT_COLOR,
          {align: 'left', font: 'bold 80px helvetica'}
        )
        drawText(ctx, 'a new game',
          TILE_WIDTH * 1.4,
          TILE_HEIGHT * 9,
          WINDOW_TEXT_COLOR,
          {align: 'left', font: 'bold 80px helvetica'}
        )
        drawText(ctx, 'Match 3 or more elements',
          TILE_WIDTH * 2.12,
          TILE_HEIGHT * 10.7,
          WINDOW_TEXT_COLOR,
          {align: 'left', font: 'bold 30px helvetica'}
        )

      drawText(ctx, "Level #{currentLvl}",
        BOARD_OFFSET_X,
        120,
        GAME_TEXT_COLOR,
        {align: 'left', font: 'bold 80px helvetica'}
      )
      drawText(ctx, "Last best: #{lastBestLvl}",
        BOARD_OFFSET_X,
        CANVAS_HEIGHT - 40,
        GAME_TEXT_COLOR,
        {align: 'left', font: 'bold 20px helvetica'}
      )
      drawText(ctx, 'GSSOC',
        CANVAS_WIDTH - BOARD_OFFSET_X,
        CANVAS_HEIGHT - 40,
        GAME_TEXT_COLOR,
        {align: 'right', font: 'bold 20px helvetica'}
      )

The main loop of the game.

    step = 1 / FPS
    modifier = 1
    mStep = step * modifier
    dt = 0
    previousTime = new Date()

    requestAnimationFrame tick = ->
      currentTime = new Date()
      dt += Math.min(1, (currentTime - previousTime) / 1000)
      previousTime = currentTime

      while dt > mStep
        update(step)
        dt -= mStep
      render()
      requestAnimationFrame tick
