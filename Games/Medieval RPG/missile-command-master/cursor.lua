cursor = class('cursor')

function cursor:initialize(x,y)
    
    self.x = x
    self.y = y
    self.width = 36
    self.height = 8
    
end

function cursor:draw()
    
    love.graphics.setColor(255,255,255)
    love.graphics.rectangle('fill',self.x - (self.width / 2),self.y,self.width,self.height)
    
end