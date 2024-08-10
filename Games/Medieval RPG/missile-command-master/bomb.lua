bomb = class('bomb')

function bomb:initialize(world,x,y)
    
    self.xtarget = x
    self.ytarget = y
    
    self.body = love.physics.newBody(world,400,500,"kinematic")
    local vx = x - game.bombtower.x
    local vy = y - game.bombtower.y
    self.body:setBullet(true)
    self.body:setLinearVelocity(vx,vy)    
    
    self.shape = love.physics.newRectangleShape(x,y,8,4)
    local x1, y1, x2, y2 = self.shape:computeAABB(0,0,0)
    self.width = x2 - x1
    self.height = y2 - y1

    self.fixture = love.physics.newFixture(self.body, self.shape, 1.0)
    
end

function bomb:draw()
    
    love.graphics.setColor(math.random(0,255),math.random(0,255),math.random(0,255))
    love.graphics.rectangle('fill',self.body:getX(),self.body:getY(),self.width,self.height)    
    
end