class TankRoamingState < TankMotionState
  def initialize(object, vision)
    super
    @object = object
    @vision = vision
  end

  def update
    change_direction if should_change_direction?
    if substate_expired?
      rand > 0.2 ? drive : wait
    end
  end

  def required_powerups
    required = []
    health = @object.health.health
    if @object.fire_rate_modifier < 2 && health > 50
      required << FireRatePowerup
    end
    if @object.speed_modifier < 1.5 && health > 50
      required << TankSpeedPowerup
    end
    if health < 100
      required << RepairPowerup
    end
    if health < 190
      required << HealthPowerup
    end
    required
  end

  def change_direction
    closest_powerup = @vision.closest_powerup(
      *required_powerups)
    if closest_powerup
      @seeking_powerup = true
      angle = Utils.angle_between(
        @object.x, @object.y,
        closest_powerup.x, closest_powerup.y)
      @object.physics.change_direction(
        angle - angle % 45)
      # Go away from inaccessable powerup
      unless @vision.can_go_forward?
        @seeking_powerup = false
        @object.physics.change_direction(
          @object.direction + 180)
      end
    else
      @seeking_powerup = false
      change = case rand(0..100)
      when 0..30
        -45
      when 30..60
        45
      when 60..80
        90
      when 80..100
        -90
      end
      @object.physics.change_direction(
        @object.direction + change)
    end
    @changed_direction_at = Gosu.milliseconds
    @will_keep_direction_for = turn_time
  end

  def wait_time
    rand(50..400)
  end

  def drive_time
    rand(1000..3000)
  end

  def turn_time
    if @seeking_powerup
      rand(100..300)
    else
      rand(1000..3000)
    end
  end
end
