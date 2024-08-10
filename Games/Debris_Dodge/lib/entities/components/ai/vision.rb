class AiVision
  CACHE_TIMEOUT = 500
  POWERUP_CACHE_TIMEOUT = 50
  attr_reader :in_sight

  def initialize(viewer, object_pool, distance)
    @viewer = viewer
    @object_pool = object_pool
    @distance = distance
  end

  def can_go_forward?
    in_front = Utils.point_at_distance(
      *@viewer.location, @viewer.direction, 40)
    @object_pool.map.can_move_to?(*in_front) &&
      @object_pool.nearby_point(*in_front, 40, @viewer)
        .reject { |o| o.is_a? Powerup }.empty?
  end

  def update
    @in_sight = @object_pool.nearby(@viewer, @distance)
  end

  def closest_free_path(away_from = nil)
    paths = []
    5.times do |i|
      if paths.any?
        return farthest_from(paths, away_from)
      end
      radius = 55 - i * 5
      range_x = range_y = [-radius, 0, radius]
      range_x.shuffle.each do |x|
        range_y.shuffle.each do |y|
          x = @viewer.x + x
          y = @viewer.y + y
          if @object_pool.map.can_move_to?(x, y) &&
              @object_pool.nearby_point(x, y, radius, @viewer)
                .reject { |o| o.is_a? Powerup }.empty?
            if away_from
              paths << [x, y]
            else
              return [x, y]
            end
          end
        end
      end
    end
    false
  end

  alias :closest_free_path_away_from :closest_free_path

  def closest_tank
    now = Gosu.milliseconds
    @closest_tank = nil
    if now - (@cache_updated_at ||= 0) > CACHE_TIMEOUT
      @closest_tank = nil
      @cache_updated_at = now
    end
    @closest_tank ||= find_closest_tank
  end

  def closest_powerup(*suitable)
    now = Gosu.milliseconds
    @closest_powerup = nil
    if now - (@powerup_cache_updated_at ||= 0) > POWERUP_CACHE_TIMEOUT
      @closest_powerup = nil
      @powerup_cache_updated_at = now
    end
    @closest_powerup ||= find_closest_powerup(*suitable)
  end

  private

  def farthest_from(paths, away_from)
    paths.sort do |p1, p2|
      Utils.distance_between(*p1, *away_from) <=>
        Utils.distance_between(*p2, *away_from)
    end.first
  end

  def find_closest_powerup(*suitable)
    if suitable.empty?
      suitable = [FireRatePowerup,
                  HealthPowerup,
                  RepairPowerup,
                  TankSpeedPowerup]
    end
    @in_sight.select do |o|
      suitable.include?(o.class)
    end.sort do |a, b|
      x, y = @viewer.x, @viewer.y
      d1 = Utils.distance_between(x, y, a.x, a.y)
      d2 = Utils.distance_between(x, y, b.x, b.y)
      d1 <=> d2
    end.first
  end

  def find_closest_tank
    @in_sight.select do |o|
      o.class == Tank && !o.health.dead?
    end.sort do |a, b|
      x, y = @viewer.x, @viewer.y
      d1 = Utils.distance_between(x, y, a.x, a.y)
      d2 = Utils.distance_between(x, y, b.x, b.y)
      d1 <=> d2
    end.first
  end
end
