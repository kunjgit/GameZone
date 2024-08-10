class TankFightingState < TankMotionState
  def initialize(object, vision)
    super
    @object = object
    @vision = vision
  end

  def update
    change_direction if should_change_direction?
    if substate_expired?
      rand > 0.1 ? drive : wait
    end
  end

  def change_direction
    change = case rand(0..100)
    when 0..20
      -45
    when 20..40
      45
    when 40..60
      90
    when 60..80
      -90
    when 80..90
      135
    when 90..100
      -135
    end
    @object.physics.change_direction(
      @object.direction + change)
    @changed_direction_at = Gosu.milliseconds
    @will_keep_direction_for = turn_time
  end

  def wait_time
    rand(50..300)
  end

  def drive_time
    rand(5000..10000)
  end

  def turn_time
    rand(300..3000)
  end
end
