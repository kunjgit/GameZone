class DemoState < PlayState
  attr_accessor :tank

  def enter
    # Prevent reactivating HUD
  end

  def update
    super
    @score_display = ScoreDisplay.new(
      object_pool, 20)
  end

  def draw
    super
    @score_display.draw_top_right
  end

  def button_down(id)
    super
    if id == Gosu::KbSpace
      target_tank = @tanks.reject do |t|
        t == @camera.target
      end.sample
      switch_to_tank(target_tank)
    end
  end

  private

  def create_tanks(amount)
    @map.spawn_points(amount * 3)
    @tanks = []
    amount.times do |i|
      @tanks << Tank.new(@object_pool, AiInput.new(
        @names.random, @object_pool))
    end
    target_tank = @tanks.sample
    @hud = HUD.new(@object_pool, target_tank)
    @hud.active = false
    switch_to_tank(target_tank)
  end

  def switch_to_tank(tank)
    @camera.target = tank
    @hud.player = tank
    self.tank = tank
  end
end
