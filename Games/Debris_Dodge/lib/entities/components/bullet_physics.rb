class BulletPhysics < Component
  START_DIST = 20
  MAX_DIST = 500

  def initialize(game_object, object_pool)
    super(game_object)
    x, y = point_at_distance(START_DIST)
    object.move(x, y)
    @object_pool = object_pool
    if trajectory_length > MAX_DIST
      object.target_x, object.target_y = point_at_distance(MAX_DIST)
    end
  end

  def update
    fly_speed = Utils.adjust_speed(object.speed)
    now = Gosu.milliseconds
    @last_update ||= object.fired_at
    fly_distance = (now - @last_update) * 0.001 * fly_speed
    object.move(*point_at_distance(fly_distance))
    @last_update = now
    check_hit
    object.explode if arrived?
  end

  def trajectory_length
    Utils.distance_between(object.target_x, object.target_y, x, y)
  end

  def point_at_distance(distance)
    if distance > trajectory_length
      return [object.target_x, object.target_y]
    end
    distance_factor = distance.to_f / trajectory_length
    p_x = x + (object.target_x - x) * distance_factor
    p_y = y + (object.target_y - y) * distance_factor
    [p_x, p_y]
  end

  private

  def check_hit
    @object_pool.nearby(object, 50).each do |obj|
      next if obj == object.source # Don't hit source tank
      if obj.class == Tree
        if Utils.distance_between(x, y, obj.x, obj.y) < 10
          return do_hit(obj) if obj.respond_to?(:health)
        end
      elsif Utils.point_in_poly(x, y, *obj.box)
        # Direct hit - extra damage
        return do_hit(obj) if obj.respond_to?(:health)
      end
    end
  end

  def do_hit(obj)
    obj.health.inflict_damage(20, object.source)
    object.target_x = x
    object.target_y = y
  end

  def arrived?
    x == object.target_x && y == object.target_y
  end
end
