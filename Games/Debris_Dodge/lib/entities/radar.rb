class Radar
  UPDATE_FREQUENCY = 1000
  WIDTH = 150
  HEIGHT = 100
  PADDING = 10
  # Black with 33% transparency
  BACKGROUND = Gosu::Color.new(255 * 0.33, 0, 0, 0)
  attr_accessor :target

  def initialize(object_pool, target)
    @object_pool = object_pool
    @target = target
    @last_update = 0
  end

  def update
    if Gosu.milliseconds - @last_update > UPDATE_FREQUENCY
      @nearby = nil
    end
    @nearby ||= @object_pool.nearby(@target, 2000).select do |o|
      o.class == Tank && !o.health.dead?
    end
  end

  def draw
    x1, x2, y1, y2 = radar_coords
    $window.draw_quad(
      x1, y1, BACKGROUND,
      x2, y1, BACKGROUND,
      x2, y2, BACKGROUND,
      x1, y2, BACKGROUND,
      200)
    draw_tank(@target, Gosu::Color::GREEN)
    @nearby && @nearby.each do |t|
      draw_tank(t, Gosu::Color::RED)
    end
  end

  private

  def draw_tank(tank, color)
    x1, x2, y1, y2 = radar_coords
    tx = x1 + WIDTH / 2 + (tank.x - @target.x) / 20
    ty = y1 + HEIGHT / 2 +  (tank.y - @target.y) / 20
    if (x1..x2).include?(tx) && (y1..y2).include?(ty)
      $window.draw_quad(
        tx - 2, ty - 2, color,
        tx + 2, ty - 2, color,
        tx + 2, ty + 2, color,
        tx - 2, ty + 2, color,
        300)
    end
  end

  def radar_coords
    x1 = $window.width - WIDTH - PADDING
    x2 = $window.width - PADDING
    y1 = $window.height - HEIGHT - PADDING
    y2 = $window.height - PADDING
    [x1, x2, y1, y2]
  end
end
