class Tank < GameObject
  SHOOT_DELAY = 500
  attr_accessor :throttle_down, :direction,
    :gun_angle, :sounds, :physics, :graphics, :health, :input,
    :fire_rate_modifier, :speed_modifier

  def initialize(object_pool, input)
    x, y = object_pool.map.spawn_point
    super(object_pool, x, y)
    @input = input
    @input.control(self)
    @physics = TankPhysics.new(self, object_pool)
    @sounds = TankSounds.new(self, object_pool)
    @health = TankHealth.new(self, object_pool)
    @graphics = TankGraphics.new(self)
    @direction = rand(0..7) * 45
    @gun_angle = rand(0..360)
    reset_modifiers
  end

  def box
    @physics.box
  end

  def on_collision(object)
    return unless object
    # Avoid recursion
    if object.class == Tank
      # Inform AI about hit
      object.input.on_collision(object)
    else
      # Call only on non-tanks to avoid recursion
      object.on_collision(self)
    end
    # Bullets should not slow Tanks down
    if object.class != Bullet
      @sounds.collide if @physics.speed > 1
    end
  end

  def shoot(target_x, target_y)
    if can_shoot?
      @last_shot = Gosu.milliseconds
      Bullet.new(object_pool, @x, @y, target_x, target_y).fire(
        self, 1500)
      input.stats.add_shot
    end
  end

  def can_shoot?
    Gosu.milliseconds - (@last_shot || 0) >
      (SHOOT_DELAY / @fire_rate_modifier)
  end

  def reset_modifiers
    @fire_rate_modifier = 1
    @speed_modifier = 1
  end

  def to_s
    "Tank [#{@health.health}@#{@x}:#{@y}@#{@physics.speed.round(2)}px/tick]#{@input.stats}"
  end

end
