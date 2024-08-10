game = class('game')

function game:initialize()
    
    self.screen = {}
    self.screen.width = 800
    self.screen.height = 600
    self.audio = audio:new()
    self.missiles = {}
    self.bombs = {}
    self.explosions = {}
    self.cursor = cursor:new(350,350)
    self.bombtower = {}
    self.bombtower.x = 400
    self.bombtower.y = 500
    self.current_level = 1
    self.level = level:new(self.current_level)
    self.score = score:new()
    self.cities = self:buildCities()
    self.audio:play('start_level')
    self.game_over = false

    cron = require 'cron'
    cron.every(self.level.missile_interval,launchMissiles)

    imgfont = love.graphics.newImageFont('gfx/imgfont2.png'," ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")
    love.graphics.setFont(imgfont)
    
end

function game:update(dt)

    if self.level.num_missiles == self.level.launched_missiles and table.getn(self.missiles) == 0 and self.level.num_missiles > 0 and not self.game_over then
        
        self.score:add(self.level.num_bombs * 5) -- extra bomb bonus
        
        if table.getn(self.cities) > 0 and self.current_level < 9 then
        
            self:advanceLevel()
            
        else
            
            self:gameOver()
            
        end
        
    end
            
    cron.update(dt)
            
    for k,e in pairs(self.explosions) do

        -- check for exploded missiles
        for k,missile in pairs(self.missiles) do
            if e.shape:testPoint(0,0,0,missile.body:getX(),missile.body:getY()) then
                local exp = explosion:new(world,missile.body:getX(),missile.body:getY() - 15)
                table.insert(self.explosions,exp)
                                
                missile.body:destroy()
                self.audio:play('boom')
                table.remove(self.missiles,k)
                self.level.destroyed_missiles = self.level.destroyed_missiles + 1
                self.score:add(25)
            end
        end
                    
        if not e:update() then
            table.remove(self.explosions,k)
        end
        
    end


    for ck,city in pairs(self.cities) do
        
        for k,missile in pairs(self.missiles) do            
        
            if city.shape:testPoint(0,0,0,missile.body:getX(),missile.body:getY()) then
                local e = explosion:new(world,missile.body:getX(),missile.body:getY() - 10)
                table.insert(self.explosions,e)
                                
                missile.body:destroy()
                self.audio:play('boom')
                table.remove(self.missiles,k)
                self.level.destroyed_missiles = self.level.destroyed_missiles + 1
                
                city.body:destroy()
                table.remove(self.cities,ck)
                break                
            end
            
        end
        
    end
        
    for k,missile in pairs(self.missiles) do
        
        if missile.body:getY() > 525 then
            missile.body:destroy()
            table.remove(self.missiles,k)
            self.level.destroyed_missiles = self.level.destroyed_missiles + 1
        end
        
    end
    
    for k,b in pairs(self.bombs) do
                
        if self:testCollision(b.body,b.xtarget,b.ytarget) then
                                
            local e = explosion:new(world,b.xtarget,b.ytarget)
            table.insert(self.explosions,e)
            
            b.body:destroy()
            table.remove(self.bombs,k)
                        
        end
        
    end
    
    if love.keyboard.isDown('up') and self.cursor.y > 0 then
        self.cursor.y = self.cursor.y - 8
    elseif self.cursor.y < 0 then
        self.cursor.y = 0
    end
    
    if love.keyboard.isDown('right') and self.cursor.x < self.screen.width then
        self.cursor.x = self.cursor.x + 8
    elseif self.cursor.x > self.screen.width then
        self.cursor.x = self.screen.width
    end
    
    if love.keyboard.isDown('down') and self.cursor.y < (self.bombtower.y - self.cursor.height) then
        self.cursor.y = self.cursor.y + self.cursor.height
    elseif self.cursor.y > self.bombtower.y then
        self.cursor.y = self.bombtower.y
    end
    
    if love.keyboard.isDown('left') and self.cursor.x > 0 then
        self.cursor.x = self.cursor.x - 8
    elseif self.cursor.x < 0 then
        self.cursor.x = 0
    end    
    
end

function game:draw()
    
    love.graphics.setBackgroundColor(self.level.background_color)
    
    for k,b in pairs(self.bombs) do
        
        b:draw()
                    
    end

    for k,m in pairs(self.missiles) do
        
        m:draw(self.level.missile_tail_color,self.level.missile_color)
                
    end
    
    for k,c in pairs(self.cities) do
        
        c:draw(self.level.city_color)
        
    end    
    
    for k,e in pairs(self.explosions) do
        
        e:draw()
        
    end
        
    self.cursor:draw()
    
    self.score:draw()
    
    self:drawInanimateObjects()
        
end

function game:launchMissile()
    
    if self.level.num_missiles > self.level.launched_missiles and not self.audio.start:isPlaying() then
    
        local xcoords = {112,115,110,120,105,700,176,247,554,625,696,400,683}
        local index = math.random(1,13)
        local xcoord = xcoords[index]
        local ycoord = 35
        local m = missile:new(world,xcoord,ycoord,self.level.missile_speed)

        table.insert(self.missiles,m)
        self.level.launched_missiles = self.level.launched_missiles + 1
        
    end
    
end

function game:shoot()
    
    if self.level.num_bombs > 0 then
            
        local b = bomb:new(world,self.cursor.x,self.cursor.y)    
        table.insert(self.bombs,b)
        self.level.num_bombs = self.level.num_bombs - 1
        self.audio:play('launch')
        
    else
        
        self.audio:play('no_ammo')
        
    end
    
end

function game:testCollision(body,x,y)

    local vx1 = body:getX() - game.bombtower.x
    local vy1 = body:getY() - game.bombtower.y
    
    local vx2 = x - game.bombtower.x
    local vy2 = y - game.bombtower.y
    
    if vx1 - vx2 < 4 and vy1 - vy2 < 4 then
        return true
    end

    return false

end

function game:gameOver()
    
    self.game_over = true
    self.audio:play('game_over')
    
end

function game:startOver()
    
    self.audio:play('start_level')
    self.current_level = 1
    self.cities = self:buildCities()
    self.game_over = false
    self.score.total = 0
    self.level = level:new(self.current_level)
    cron.reset()
    cron.every(self.level.missile_interval,launchMissiles)    
    
end

function game:advanceLevel()
    
    if self.current_level < 9 then
        
        self.audio:play('start_level')        
        self.current_level = self.current_level + 1        
        self.level = level:new(self.current_level)
        cron.reset()
        cron.every(self.level.missile_interval,launchMissiles)        
        
    else
        
        self:gameOver()
        
    end
    
end

function game:drawInanimateObjects()
    
    -- ground
    love.graphics.setColor(self.level.ground_color)
    love.graphics.rectangle('fill',0 ,525,self.screen.width,75)
    love.graphics.rectangle('fill',0,500,50,25)
    love.graphics.rectangle('fill',750,500,50,25)
    love.graphics.rectangle('fill',300,515,200,10)
    love.graphics.rectangle('fill',325,505,150,10)
    love.graphics.rectangle('fill',350,495,100,10)
    
    -- bomb
    if self.level.num_bombs > 0 then
        
        love.graphics.setColor(math.random(0,255),math.random(0,255),math.random(0,255))
        love.graphics.rectangle('fill',self.bombtower.x,self.bombtower.y - 8,8,4)    
        
    end
    
end

function game:buildCities()
    
    return {city:new(105,513),city:new(176,513),city:new(247,513),city:new(554,513),city:new(625,513),city:new(696,513)}
    
end

function launchMissiles()
    
    local num_missiles = math.random(1,game.level.max_concurrent_missiles)
    
    for i=1, num_missiles do
        game:launchMissile()
    end
    
end