missile = class('missile')

function missile:initialize(world,x,y,missile_speed)
    
    self.xorigin = x
    self.yorigin = y
    self.width = 10
    self.height = 8
    
    self.body = love.physics.newBody(world,x,y,'kinematic')
    self.body:setBullet(true)
    self.body:setLinearVelocity(self:getInitialLinearVelocity(missile_speed))
    
    self.shape = love.physics.newRectangleShape(x,y,self.width,self.height)

    self.fixture = love.physics.newFixture(self.body, self.shape, 0.1)
        
end

function missile:getInitialLinearVelocity(speed)
    
    local rate = (9 - speed) * 2
    local xcoords = {95,105,110,120,690,169,240,554,625,696,683,550}
    
    vx = xcoords[math.random(1,12)] - self.xorigin
    vy = 500 - self.yorigin
    
    return vx/rate,vy/rate
    
end

function missile:draw(tail_color, color)
    
    love.graphics.setColor(tail_color)
    love.graphics.line(self.xorigin,self.yorigin,self.xorigin + self.height,self.yorigin,self.body:getX() + 2,self.body:getY(),self.body:getX(),self.body:getY(),self.xorigin,self.yorigin)
    
    love.graphics.setColor(color)
    love.graphics.rectangle('fill',self.body:getX(),self.body:getY(),self.width,self.height)
    
end