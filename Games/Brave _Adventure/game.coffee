#---------------------------------------------------------------
#     Engine Core
#---------------------------------------------------------------

GC = window._GAME_CONSTATS_ =
   author: 'Kamil Misiowiec'

#---------------------------------------------------------------
#     Engine Core
#---------------------------------------------------------------

# this could be image or text for now
class DisplayObject
   constructor: ( @x = 0, @y = 0 ) ->
      @width = 0
      @height = 0

   draw: ( ctx ) -> throw new Error 'Draw method should be overriden'

class Layer extends DisplayObject
   constructor: ->
      super arguments...
      @childs = [ ]

   draw: ( ctx ) ->
      ctx.save( )
      ctx.translate @x, @y
      for child in @childs
         child.draw ctx
      ctx.restore( )

   addChild: ( child ) ->
     @childs.push child

   removeChild: ( child ) ->
     @childs.splice @childs.indexOf( child ), 1

   onMouseDown: ( x, y ) ->
     for child in @childs
       if child instanceof Layer
         child.onMouseDown( x, y )
       else if child.x + @x < x < child.x + @x + child.width and
               child.y + @y < y < child.y + @y + child.height
         child.onMouseDown?( )
     return

class Stage extends Layer
   constructor: ( @canvas, rest... ) ->
     super rest...
     @ctx = @canvas.getContext '2d'
     @ctx.webkitImageSmoothingEnabled = false
     @ctx.mozImageSmoothingEnabled = false
     
     @ctx.scale 2, 2
     @width = @canvas.width / 2
     @height = @canvas.height / 2

     @canvas.addEventListener 'mousedown', @_onMouseDown.bind @

   render: -> @draw @ctx

   _onMouseDown: ( event ) ->
      mouseX = event.pageX - @canvas.offsetLeft
      mouseY = event.pageY - @canvas.offsetTop
      @onMouseDown( mouseX / 2, mouseY / 2)


class Text extends DisplayObject
   constructor: ( @text, @font = '20px Arial', @color = 'black' ) ->
     super( )

   draw: ( ctx ) ->
     ctx.font = @font
     ctx.fillStyle = @color
     ctx.fillText @text, @x, @y

# static class
class Loader
   
   @images: { }

   @load: ( files ) ->
      for file in files when not @images[file]?
         @images[file] = new Image
         @images[file].src = file
      @_checkIfReady( )

   @onready: null

   @_checkIfReady: ->
      for src, img of @images
         if not img.complete
            return setTimeout @_checkIfReady.bind(@), 50
      return @onready( )
#---------------------------------------------------------------
#     Game Core
#---------------------------------------------------------------

class Entity
   constructor: ( @x = 0, @y = 0 ) ->
      @set
         hp: 0
         level: 0
         id: 32

   set: ( obj ) ->
      @[prop] = val for prop, val of obj
      return

class Map
   #static member
   @Obstacle = [ 0 ]

   constructor: ->
      @data = [ ]
      @enemies = [ ]

      for y in [0..100]
         row = [ ]; @data.push row
         for x in [0..9]
            row.push [ [ ((Math.random()*4)|0) + 1 ], [ ] ]

      # map data created by user
      map = [
        '@@@@@@@@@@'
        '@@@@@@@@@@'
        '@@@@@@@@@@'
        '@@@@@@@@@@'
        '@@@@@@@@@@'
        '@@@@@@@@@@'
        '@@@@@@@@@@'
        '@@@@@@@@@@'
        '@@@@@@@@@@'
        '@@@@@@@@@@'
        '@@@@@@@@@@'
        '@@...r..@@'
        '@@......@@'
        '@@@@@|@@@@'
        '....e|e...'
        '.....|....'
        '...>-]....'
        '..q|.q....'
        '...[---<..'
        '..@@@@@|..'
        'w.@@@@@|.e'
        '..@@@@@|..'
        '.w..>--]e.'
        '...>].....'
        '@..|@q....'
        '.@@|@@....'
        '@@@|@@@@@@'
        '..e|......'
        '...|..w...'
        '@q@[<.....'
        '@@@@[<..e.'
        '@@@@@[<...'
        '@@@@@@|.q.'
        '@@.@@@|...'
        '@@@@@>]...'
        '.@@@>]..w.'
        '...@|.w...'
        '.q..|....@'
        '....|.q.@@'
        '...>]....@'
        '..q|..q...'
        '@.@[<...w.'
        '@@@@[<....'
        '@@@@@[<..q'
        '@@@@@@|...'
        '@@.@@@|.q.'
        '@@@@@>]...'
        '.@@@>]..q.'
        '...@|....@'
        '....|....@'
        '....|...@@'
        '....|...@@'
      ]

      tile =
         '@': 0
         '|': 16
         '>': 21
         ']': 20
         '[': 18
         '<': 17
         '-': 19

      enemy =
         'q': 48
         'w': 49
         'e': 50
         'r': 51

      # glue map data with map
      for row, y in map
         for char, x in row
            if tile[char] isnt undefined
               @data[y][x][0].push tile[char]
            else if enemy[char]
               e = new Enemy enemy[char]
               @enemies.push e
               @addEntity e, x, y
               
      #endof constructor

   canIMoveTo: ( x, y ) ->
      0 < x < 10 and  0 < y < @data.length and
      not ( @data[y][x][0].some( (obj) -> obj in Map.Obstacle ) or
      @data[y][x][1].length > 0 )

   isSomeoneOn: ( x, y ) ->
      @data[y][x][1].some (e, i) -> i > 0 and e?

   getEntitiesAt: ( x, y ) ->
      @data[y][x][1]

   getEntitesAround: (x, y) ->
      @enemies.filter (enemy) ->
         x - 1 <= enemy.x <= x + 1 and y - 1 <= enemy.y <= y + 1

   removeEntity: (entity) ->
      (_r = @data[entity.y][entity.x][1]).splice _r.indexOf(entity), 1
      for e, i in @enemies
         if e.pesel is entity.pesel
            @enemies.splice i, 1
            return
      return


   addEntity: (entity, x, y) ->
      entity.x = x; entity.y = y
      (@data[y][x][1] ?= []).push entity


   moveTo: ( entity, x, y ) ->
      return unless @canIMoveTo x, y
      startTile = @getEntitiesAt entity.x, entity.y
      endTile = @getEntitiesAt x, y
      # remove entity from old tile
      startTile.splice startTile.indexOf( entity ), 1
      # udate pos of entity
      entity.set {x: x, y: y}
      # move entity
      endTile.push entity
      return

class MapRenderer extends DisplayObject

   constructor: ( @map, rest... )->
      super rest...
      @srcImg = Loader.images['img/tiles.png']

   draw: ( ctx ) ->
      ctx.save( )
      ctx.translate @x, @y

      for row, y in @map.data
         for layer, x in row
            for tile in layer[0]
               sx = tile  % 16
               sy = ( tile / 16 ) | 0
               ctx.drawImage @srcImg, sx*16, sy*16, 16, 16, x * 16, y * 16, 16, 16
            for entity in layer[1]
               sx = entity.id  % 16
               sy = ( entity.id / 16 ) | 0
               ctx.drawImage @srcImg, sx*16, sy*16, 16, 16, x * 16, y * 16, 16, 16

      ctx.restore( )
     
class Hero extends Entity
   constructor: ->
      super arguments...
      @id = 32
      @hp = 3

class Enemy extends Entity

   @lastEnemyPesel = 0

   @hitpointsById =
      48: 1
      49: 3
      50: 4
      51: 8

   @damageById =
      48: 1
      49: 2
      50: 2
      51: 3

   constructor: ( id = 48 ) ->
      super arguments...
      @id = id
      @pesel = Enemy.lastEnemyPesel++
      @hp = Enemy.hitpointsById[id]

   hit: ->
      return unless --@hp < 1
      Game.Ctx.map.removeEntity this
      Game.Ctx.map.data[@y][@x][0].push 80
      if @id is 51
         setTimeout Game.Ctx.onGameWin.bind Game.Ctx, 0

   update: ( hero, map ) ->
      
      dist =
         x: hero.x - @x
         y: hero.y - @y

      if Math.abs(dist.x) < 3 and Math.abs(dist.y) < 3
         #hero in range
         map.moveTo this, @x + (dist.x/Math.abs dist.x), @y + (dist.y/Math.abs dist.y)
      else
         map.moveTo this, @x + Math.round(Math.random()*3-1.5), @y

      if @x - 1 <= hero.x <= @x + 1 and @y - 1 <= hero.y <= @y + 1
         hero.hp -= Enemy.damageById[@id]
         if hero.hp < 1 then setTimeout Game.Ctx.onGameEnd.bind Game.Ctx, 0
      return

   _distnaceToHero: ( hero, map ) ->
      x: hero.x - @x
      y: hero.y - @y


class Game
   @Ctx = null

   constructor: ->
      Game.Ctx = this
      @map = new Map
      @hero = new Hero
      @actionManager = new ActionManager

      @map.addEntity @hero, 4, 48
      @mapRenderer = new MapRenderer @map
      @actionBar = new ActionBar @actionManager
      @actionBar.update( )
      @healthBar = new HealthBar @hero.hp
      @actionCounterBar = new ActionCounterBar Action.movesLeft

      GC.stage.addChild @mapRenderer
      GC.stage.addChild @actionBar
      GC.stage.addChild @healthBar
      GC.stage.addChild @actionCounterBar


   makeStep: ->
      for enemy in @map.enemies
         enemy.update @hero, @map

      @actionBar.update( )
      @actionCounterBar.update Action.movesLeft
      @healthBar.update @hero.hp
      @render( )

   render: ->
      @mapRenderer.y = -(@hero.y - 9)*16
      GC.stage.render( )

   onGameEnd: ->
      # ugly solution
      # Game.Ctx = null
      GC.stage.ctx.drawImage Loader.images['img/gameover.png'], 0, 0
      GC.stage.childs = []
      #console.log 'Game Over'

   onGameWin: ->
      GC.stage.ctx.drawImage Loader.images['img/gamewin.png'], 0, 0
      GC.stage.childs = []
      


#---------------------------------------------------------------
#     Game mechanics
#---------------------------------------------------------------

class Action

   @lastID = 0
   @movesLeft = 2

   constructor: ( @icon = 0 ) ->
      @id = Action.lastID++

   execute: (callbackOnReady) ->
      @_execute( ); callbackOnReady( )

   _execute: -> throw new Error 'This method should be overriden'

   do: ->
      actions = [this].concat @_getComboActions( )
      do next = (i=0) =>
         if i is actions.length
            @_done( )
         else
            actions[i].execute ->
               Game.Ctx.actionManager.replaceWithNew actions[i]
               next i + 1

   _done: ->
      Action.movesLeft -= 1
      Game.Ctx.actionCounterBar.update Action.movesLeft
      if Action.movesLeft < 1
         Action.movesLeft = 2
         Game.Ctx.makeStep( )
      else
         Game.Ctx.actionBar.update( )
         Game.Ctx.render( )

   _getComboActions: ->
      combo  = []
      Game.Ctx.actionManager.currentActions.forEach (action, i) =>
         if action.id is @id
            combo = @_countLeft( i - 1 ).concat @_countRight( i + 1 )
      return combo

   _countLeft: ( i ) ->
      return [ ] unless i >= 0
      act = Game.Ctx.actionManager.currentActions[i]
      if act instanceof this.constructor
         return [act].concat @_countLeft i - 1
      else
         return [ ]
         
   _countRight: ( i ) ->
      return [ ] unless i < Game.Ctx.actionManager.currentActions.length
      act = Game.Ctx.actionManager.currentActions[i]
      if act instanceof this.constructor
         return [act].concat @_countRight i + 1
      else
         return [ ]

class AttackAction extends Action

   constructor: -> super 0
   _execute: ->
      { x, y } = Game.Ctx.hero
      Game.Ctx.map.getEntitesAround(x, y).forEach (enemy) ->
         enemy.hit( )


class PotionAction extends Action
   constructor: -> super 6
   _execute: ->
      if Game.Ctx.hero.hp < 10
         hp = Game.Ctx.hero.hp += 1
         Game.Ctx.healthBar.update hp

class AnotherActionAction extends Action
   constructor: -> super 7
   _execute: ->
      return unless Action.movesLeft < 4
      left = Action.movesLeft += 2
      Game.Ctx.actionCounterBar.update left
      GC.stage.render( )

class MoveAction extends Action
   constructor: -> super 5

   execute: (callbackOnReady) ->
      Game.Ctx.actionBar.askForDirection (action) =>
         action._execute( )
         Game.Ctx.render( )
         callbackOnReady( )

class MoveFowardAction extends Action

   constructor: -> super 1

   _execute: ->
     { x, y } = Game.Ctx.hero
     Game.Ctx.map.moveTo Game.Ctx.hero, x, y-1

class MoveLeftAction extends Action

   constructor: -> super 3

   _execute: ->
     { x, y } = Game.Ctx.hero
     Game.Ctx.map.moveTo Game.Ctx.hero, x-1, y

class MoveRightAction extends Action

   constructor: -> super 2

   _execute: ->
     { x, y } = Game.Ctx.hero
     Game.Ctx.map.moveTo Game.Ctx.hero, x+1, y

class ActionManager
   constructor: ->
      @_ActionClasses = [
         MoveAction
         AttackAction
         AnotherActionAction
         PotionAction
      ]

      @currentActions = [ ]
      @reset( )

   reset: ->
      @currentActions = []
      for i in [0...5]
         @currentActions.push @_getNewRandomAction( )

   replaceWithNew: ( old ) ->
      i = @currentActions.indexOf old
      @currentActions[i] = @_getNewRandomAction( )

   _getNewRandomAction: ->
      len = @_ActionClasses.length
      lot = (Math.pow(2.5,x) for x in [1..len] by 1)
      lot.reverse( )
      lot[0] = lot[0]/2 + 1

      rnd = Math.random( )*lot.reduce (a,b) -> a+b
      sum = 0
      for chance, i in lot
         sum += chance
         if sum > rnd
            return new @_ActionClasses[i]
      return

      new @_ActionClasses[(Math.random()*len)|0]
      


#---------------------------------------------------------------
#     UI
#---------------------------------------------------------------
class Button extends DisplayObject

   constructor: ( @id, args... ) ->
      super args...
      @img = Loader.images['img/buttons.png']
      @width = 32
      @height = 32

   draw: ( ctx ) ->
      ctx.drawImage @img, @id*32, 0, 32, 32, @x, @y, 32, 32

class ActionBar extends Layer

   constructor: ( @actionMgr ) ->
      super 0, GC.stage.height - 32
      @buttons = []
      for i in [0...5]
         button = new Button 0, i*32
         @buttons.push button
         @addChild button

   update: ->
      return unless @actionMgr.currentActions
      actions = @actionMgr.currentActions
      for button, i in @buttons
         button.id = actions[i].icon
         button.onMouseDown = actions[i].do.bind actions[i]
      return

   askForDirection: (callback) ->
      @buttons[0].id = 4
      @buttons[1].id = 3
      @buttons[1].onMouseDown = callback.bind null, new MoveLeftAction
      @buttons[2].id = 1
      @buttons[2].onMouseDown = callback.bind null, new MoveFowardAction
      @buttons[3].id = 2
      @buttons[3].onMouseDown = callback.bind null, new MoveRightAction
      @buttons[4].id = 4
      GC.stage.render( )
      

class HealthBar extends DisplayObject
   constructor: (@health = 0) ->
      super 0, 0
      @img = Loader.images['img/tiles.png']
   update: (@health) ->
   draw: (ctx) ->
      for i in [0...@health]
         ctx.drawImage @img, 16, 32, 16, 16, @x + i*16, @y, 16, 16
      return

class ActionCounterBar extends DisplayObject
   constructor: (@actions = 0) ->
      super 0, GC.stage.height - 32 - 16
      @img = Loader.images['img/tiles.png']
   update: (@actions) ->
   draw: (ctx) ->
      for i in [0..2]
         ctx.drawImage @img, 32, 32, 16, 16, @x+16*i, @y, 16, 16
      for i in [0...@actions-1]
         ctx.drawImage @img, 48, 32, 16, 16, @x+16*i, @y, 16, 16
      return
         
      

#---------------------------------------------------------------
#     Main loop
#---------------------------------------------------------------

GC.canvas = document.getElementById 'canvas'
GC.stage = stage = new Stage GC.canvas

Loader.onready = ->
   game = new Game
   game.makeStep( )
   GC.stage.render( )

Loader.load [
   'img/buttons.png'
   'img/tiles.png'
   'img/gameover.png'
   'img/gamewin.png'
]
