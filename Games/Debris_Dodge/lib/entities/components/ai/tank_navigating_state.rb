class TankNavigatingState < TankMotionState
  def initialize(object, vision)
    @object = object
    @vision = vision
  end

  def update
    change_direction if should_change_direction?
    drive
  end

  def change_direction
    closest_free_path = @vision.closest_free_path
    if closest_free_path
      @object.physics.change_direction(
        Utils.angle_between(
          @object.x, @object.y, *closest_free_path))
    end
    @changed_direction_at = Gosu.milliseconds
    @will_keep_direction_for = turn_time
  end

  def wait_time
    rand(10..100)
  end

  def drive_time
    rand(1000..2000)
  end

  def turn_time
    rand(300..1000)
  end
end
