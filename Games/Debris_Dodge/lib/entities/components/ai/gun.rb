class AiGun
  DECISION_DELAY = 300
  attr_reader :target, :desired_gun_angle

  def initialize(object, vision)
    @object = object
    @vision = vision
    @desired_gun_angle = rand(0..360)
    @retarget_speed = rand(1..5)
    @accuracy = rand(0..10)
    @aggressiveness = rand(1..5)
  end

  def adjust_angle
    adjust_desired_angle
    adjust_gun_angle
  end

  def update
    if @vision.in_sight.any?
      if @vision.closest_tank != @target
        change_target(@vision.closest_tank)
      end
    else
      @target = nil
    end

    if @target
      if (0..30 - rand(0..@accuracy)).include?(
        (@desired_gun_angle - @object.gun_angle).abs.round)
        distance = distance_to_target
        if distance - 50 <= BulletPhysics::MAX_DIST
          target_x, target_y = Utils.point_at_distance(
            @object.x, @object.y, @object.gun_angle,
            distance + 10 - rand(0..@accuracy))
          if can_make_new_decision? && @object.can_shoot? &&
              should_shoot?
            @object.shoot(target_x, target_y)
          end
        end
      end
    end
  end

  def draw(viewport)
    if $debug
      color = Gosu::Color::BLUE
      x, y = @object.x, @object.y
      t_x, t_y = Utils.point_at_distance(x, y, @desired_gun_angle,
                                         BulletPhysics::MAX_DIST)
      $window.draw_line(x, y, color, t_x, t_y, color, 1001)
      color = Gosu::Color::RED
      t_x, t_y = Utils.point_at_distance(x, y, @object.gun_angle,
                                         BulletPhysics::MAX_DIST)
      $window.draw_line(x, y, color, t_x, t_y, color, 1000)
    end
  end

  def distance_to_target
    Utils.distance_between(
      @object.x, @object.y, @target.x, @target.y)
  end


  def should_shoot?
    rand * @aggressiveness > 0.3
  end

  def can_make_new_decision?
    now = Gosu.milliseconds
    if now - (@last_decision ||= 0) > DECISION_DELAY
      @last_decision = now
      true
    end
  end

  def adjust_desired_angle
    @desired_gun_angle = if @target
       Utils.angle_between(
        @object.x, @object.y, @target.x, @target.y)
    else
      @object.direction
    end
  end

  def change_target(new_target)
    @target = new_target
    adjust_desired_angle
  end

  def adjust_gun_angle
    actual = @object.gun_angle
    desired = @desired_gun_angle
    if actual > desired
      if actual - desired > 180 # 0 -> 360 fix
        @object.gun_angle = (actual + @retarget_speed) % 360
        if @object.gun_angle < desired
          @object.gun_angle = desired # damp
        end
      else
        @object.gun_angle = [actual - @retarget_speed, desired].max
      end
    elsif actual < desired
      if desired - actual > 180 # 360 -> 0 fix
        @object.gun_angle = (360 + actual - @retarget_speed) % 360
        if @object.gun_angle > desired
          @object.gun_angle = desired # damp
        end
      else
        @object.gun_angle = [actual + @retarget_speed, desired].min
      end
    end
  end
end
