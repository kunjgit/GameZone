module Utils
  HEARING_DISTANCE = 1000.0
  DEBUG_COLORS = [
    Gosu::Color::RED,
    Gosu::Color::BLUE,
    Gosu::Color::YELLOW,
    Gosu::Color::WHITE
  ]
  def self.media_path(file)
    File.join(File.dirname(File.dirname(File.dirname(
      __FILE__))), 'media', file)
  end

  def self.track_update_interval
    now = Gosu.milliseconds
    @update_interval = (now - (@last_update ||= 0)).to_f
    @last_update = now
  end

  def self.title_font
    media_path('top_secret.ttf')
  end

  def self.main_font
    media_path('armalite_rifle.ttf')
  end

  def self.update_interval
    @update_interval ||= $window.update_interval
  end

  def self.adjust_speed(speed)
    speed * update_interval / 33.33
  end

  def self.button_down?(button)
    @buttons ||= {}
    now = Gosu.milliseconds
    now = now - (now % 150)
    if $window.button_down?(button)
      @buttons[button] = now
      true
    elsif @buttons[button]
      if now == @buttons[button]
        true
      else
        @buttons.delete(button)
        false
      end
    end
  end

  def self.rotate(angle, around_x, around_y, *points)
    result = []
    angle = angle * Math::PI / 180.0
    points.each_slice(2) do |x, y|
      r_x = Math.cos(angle) * (around_x - x) -
        Math.sin(angle) * (around_y - y) + around_x
      r_y = Math.sin(angle) * (around_x - x) +
        Math.cos(angle) * (around_y - y) + around_y
      result << r_x
      result << r_y
    end
    result
  end

  # http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  def self.point_in_poly(testx, testy, *poly)
    nvert = poly.size / 2 # Number of vertices in poly
    vertx = []
    verty = []
    poly.each_slice(2) do |x, y|
      vertx << x
      verty << y
    end
    inside = false
    j = nvert - 1
    (0..nvert - 1).each do |i|
      if (((verty[i] > testy) != (verty[j] > testy)) &&
         (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) /
         (verty[j] - verty[i]) + vertx[i]))
        inside = !inside
      end
      j = i
    end
    inside
  end

  def self.distance_between(x1, y1, x2, y2)
    dx = x1 - x2
    dy = y1 - y2
    Math.sqrt(dx * dx + dy * dy)
  end

  def self.angle_between(x, y, target_x, target_y)
    dx = target_x - x
    dy = target_y - y
    (180 - Math.atan2(dx, dy) * 180 / Math::PI) + 360 % 360
  end

  def self.point_at_distance(source_x, source_y, angle, distance)
    angle = (90 - angle) * Math::PI / 180
    x = source_x + Math.cos(angle) * distance
    y = source_y - Math.sin(angle) * distance
    [x, y]
  end

  def self.mark_corners(box)
    i = 0
    box.each_slice(2) do |x, y|
      color = DEBUG_COLORS[i]
      $window.draw_triangle(
        x - 3, y - 3, color,
        x,     y,     color,
        x + 3, y - 3, color,
        100)
      i = (i + 1) % 4
    end
  end

  def self.volume(object, camera)
    return 1 if object == camera.target
    distance = Utils.distance_between(
      camera.target.x, camera.target.y,
      object.x, object.y)
    distance = [(HEARING_DISTANCE - distance), 0].max
    distance / HEARING_DISTANCE
  end

  def self.pan(object, camera)
    return 0 if object == camera.target
    pan = object.x - camera.target.x
    sig = pan > 0 ? 1 : -1
    pan = (pan % HEARING_DISTANCE) / HEARING_DISTANCE
    if sig > 0
      pan
    else
      -1 + pan
    end
  end

  def self.volume_and_pan(object, camera)
    [volume(object, camera), pan(object, camera)]
  end
end
