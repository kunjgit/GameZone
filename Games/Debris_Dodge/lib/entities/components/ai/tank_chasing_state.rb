class TankChasingState < TankMotionState
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
    @object.physics.change_direction(
      @gun.desired_gun_angle -
      @gun.desired_gun_angle % 45)

    @changed_direction_at = Gosu.milliseconds
    @will_keep_direction_for = turn_time
  end

  def drive_time
    10000
  end

  def turn_time
    rand(300..600)
  end
end
