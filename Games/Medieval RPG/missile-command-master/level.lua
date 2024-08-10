level = class('level')

function level:initialize(level_num)
    
    self.missile_color = {}
    self.missile_tail_color = {}
    self.background_color = {}
    self.city_color = {}
    self.ground_color = {}
    
    self.num_bombs = 0
    self.num_missiles = 0
    self.destroyed_missiles = 0
    self.launched_missiles = 0
    self.destroyed_cities = 0
    self.missile_speed = 0
    self.max_concurrent_missiles = 0
    
    self:loadLevel(level_num)
    
end

function level:loadLevel(level_num)
    
    self.destroyed_missiles = 0
    self.launched_missiles = 0
    self.num_bombs = 30
    self.destroyed_cities = 0
    
    if level_num == 1 then
        
        self.missile_color = {255,255,255}
        self.missile_tail_color = {255,0,0}
        self.background_color = {0,0,0,1}
        self.city_color = {0,0,255,1}
        self.ground_color = {230,158,00,1}
        self.num_missiles = 12
        self.missile_speed = 1
        self.missile_interval = 5
        self.max_concurrent_missiles = 2
        
    elseif level_num == 2 then
        
        self.missile_color = {125,48,173}
        self.missile_tail_color = {255,255,255}
        self.background_color = {147,0,0,1}
        self.city_color = {0,255,0,1}
        self.ground_color = {125,0,173,1}
        self.num_missiles = 14
        self.missile_speed = 2
        self.missile_interval = 4
        self.max_concurrent_missiles = 3
        
    elseif level_num == 3 then
        
        self.missile_color = {255,255,255}
        self.missile_tail_color = {154,252,154}
        self.background_color = {0,0,0}
        self.city_color = {0,30,255,1}
        self.ground_color = {193,209,0,1}
        self.num_missiles = 16
        self.missile_speed = 2
        self.missile_interval = 4
        self.max_concurrent_missiles = 3
        
    elseif level_num == 4 then
        
        self.missile_color = {255,255,255}
        self.missile_tail_color = {0,0,0}
        self.background_color = {212,211,0,1}
        self.city_color = {255,0,0,1}
        self.ground_color = {0,102,50,1}
        self.num_missiles = 18
        self.missile_speed = 3
        self.missile_interval = 4
        self.max_concurrent_missiles = 4
        
    elseif level_num == 5 then
        
        self.missile_color = {0,0,0}
        self.missile_tail_color = {255,255,255}
        self.background_color = {50,132,0,1}
        self.city_color = {0,162,226,1}
        self.ground_color = {0,0,0,1}
        self.num_missiles = 20
        self.missile_speed = 3
        self.missile_interval = 3
        self.max_concurrent_missiles = 4
        
    elseif level_num == 6 then
        
        self.missile_color = {255,255,255}
        self.missile_tail_color = {255,5,5}
        self.background_color = {78,0,181,1}
        self.city_color = {213,211,0,1}
        self.ground_color = {0,189,93,1}
        self.num_missiles = 22
        self.missile_speed = 4
        self.missile_interval = 3
        self.max_concurrent_missiles = 5
        
    elseif level_num == 7 then
        
        self.missile_color = {255,255,255}
        self.missile_tail_color = {0,32,53}
        self.background_color = {165,53,0,1}
        self.city_color = {0,89,193,1}
        self.ground_color = {0,0,0,1}
        self.num_missiles = 24
        self.missile_speed = 4
        self.missile_interval = 3
        self.max_concurrent_missiles = 6
        
    elseif level_num == 8 then
        
        self.missile_color = {255,0,0}
        self.missile_tail_color = {235,235,235}
        self.background_color = {0,0,0,1}
        self.city_color = {255,255,255,1}
        self.ground_color = {0,191,208,1}
        self.num_missiles = 26
        self.missile_speed = 4
        self.missile_interval = 2
        self.max_concurrent_missiles = 7
        
    elseif level_num == 9 then
        
        self.missile_color = {255,255,255}
        self.missile_tail_color = {246,0,255}
        self.background_color = {0,0,0,1}
        self.city_color = {82,251,59,1}
        self.ground_color = {181,0,170,1}
        self.num_missiles = 28
        self.missile_speed = 5
        self.missile_interval = 2
        self.max_concurrent_missiles = 8
        
    end
    
end