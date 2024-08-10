class TankStuckState < TankMotionState
  attr_accessor :stuck_at
  def initialize(object, vision, gun)
    super(object, vision)
    @object = object
    @vision = vision
    @gun = gun
  end

  def update
    change_direction if should_change_direction?
    drive
  end

  def change_direction
    closest_free_path = @vision.closest_free_path_away_from(
      @stuck_at)
    if closest_free_path
      @object.physics.change_direction(
        Utils.angle_between(
          @object.x, @object.y, *closest_free_path))
    else
      if @object.health.health > 50 && rand > 0.9
        @object.shoot(*Utils.point_at_distance(
          *@object.location,
          @object.gun_angle,
          150))
      end
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
    rand(1000..2000)
  end
end
