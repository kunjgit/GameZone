explosion = class('explosion')

function explosion:initialize(world,x,y)
    
    self.stage = 1
    self.x = x
    self.y = y
    
    self.body = love.physics.newBody(world,self.x,self.y,'dynamic')
    self.shape = love.physics.newPolygonShape(self:plotExplosion(self.stage))

    self.fixture = love.physics.newFixture(self.body, self.shape, 1.0)
    
end

function explosion:update()
    
    if self.stage == 75 then
        self.body:destroy()
        return false
    elseif self.stage < 75 then
        self.stage = self.stage + 1
        self.shape = love.physics.newPolygonShape(self:plotExplosion(self.stage))
        return true
    end
    
end

function explosion:draw()
    
    love.graphics.setColor(math.random(0,255),math.random(0,255),math.random(0,255))
    love.graphics.polygon('fill', self.shape:getPoints())    
    
end

function explosion:plotExplosion(stage)
        
    x = 0
    y = 0
    if stage < 15 then
        padding = stage * 2
    elseif stage > 15 and stage < 50 then
        padding = 45
    elseif stage >= 50 then
        padding = 80 - stage
    end
    
    return self.x,self.y - padding, self.x + padding, self.y, self.x, self.y + padding, self.x - padding, self.y    
    
end