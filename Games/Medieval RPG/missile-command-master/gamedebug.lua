gamedebug = class('gamedebug')

function gamedebug:initialize(isEnabled)
    
    self.isEnabled = isEnabled
    
end

function gamedebug:draw()
    
    if self.isEnabled then
        
        love.graphics.setColor(255,255,255)
        love.graphics.print('x: ' .. game.cursor.x .. ' y: ' .. game.cursor.y,8,8)
        love.graphics.print(love.timer.getFPS() .. ' fps',8,20)
        love.graphics.print('level: ' .. game.current_level,8,36)
        love.graphics.print('score: ' .. game.score.total,8,46)
        love.graphics.print('bombs: ' .. game.level.num_bombs,8,62)
        love.graphics.print('cities: ' .. table.getn(game.cities),8,76)
        love.graphics.print('missiles left: ' .. game.level.num_missiles - game.level.launched_missiles,8,86)
        
    end
    
end