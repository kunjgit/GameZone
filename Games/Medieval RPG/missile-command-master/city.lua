city = class('city')

function city:initialize(x,y)
    
    self.x = x
    self.y = y
    self.width = 35
    self.height = 25
    
    self.body = love.physics.newBody(world,x,y,'dynamic')
    self.shape = love.physics.newRectangleShape(x,y,self.width,self.height)
    self.fixture = love.physics.newFixture(self.body, self.shape, 0.1)
    
end

function city:draw(color)
    
    love.graphics.setColor(color)
    love.graphics.polygon('fill',self.shape:getPoints())
    
end