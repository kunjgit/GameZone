require 'middleclass'
require 'game'
require 'level'
require 'gamedebug'
require 'audio'
require 'score'
require 'cursor'
require 'city'
require 'missile'
require 'explosion'
require 'bomb'

function love.load()
    
    world = love.physics.newWorld(-800,-600,800,600,0,1.1)
    game = game:new()
    
    debug = gamedebug:new(false) -- set to true to enable debug display
    love.mouse.setVisible(false)
    
end

function love.update(dt)
    
    world:update(dt)

    game:update(dt)
        
end

function love.keypressed(key)
    
    if key == 'escape' then
        love.event.push('q')
    end
        
    if key == 'space' then
        game:shoot()
    end
    
    if game.game_over and not game.audio.over:isPlaying() then
        game:startOver()
    end
    
end

function love.draw()
    
    game:draw()
    
    debug:draw()
    
end
