class HUD
  attr_accessor :active
  def initialize(object_pool, tank)
    @object_pool = object_pool
    @tank = tank
    @radar = Radar.new(@object_pool, tank)
  end

  def player=(tank)
    @tank = tank
    @radar.target = tank
  end

  def update
    @radar.update
  end

  def health_image
    if @health.nil? || @tank.health.health != @health
      @health = @tank.health.health
      @health_image = Gosu::Image.from_text(
        "Health: #{@health}", 20, font: Utils.main_font)
    end
    @health_image
  end

  def stats_image
    stats = @tank.input.stats
    if @stats_image.nil? || stats.changed_at <= Gosu.milliseconds
      @stats_image = Gosu::Image.from_text(
        "Kills: #{stats.kills}", 20, font: Utils.main_font)
    end
    @stats_image
  end

  def fire_rate_image
    if @tank.fire_rate_modifier > 1
      if @fire_rate != @tank.fire_rate_modifier
        @fire_rate = @tank.fire_rate_modifier
        @fire_rate_image = Gosu::Image.from_text(
          "Fire rate: #{@fire_rate.round(2)}X",
          20, font: Utils.main_font)
      end
    else
      @fire_rate_image = nil
    end
    @fire_rate_image
  end

  def speed_image
    if @tank.speed_modifier > 1
      if @speed != @tank.speed_modifier
        @speed = @tank.speed_modifier
        @speed_image = Gosu::Image.from_text(
          "Speed: #{@speed.round(2)}X",
          20, font: Utils.main_font)
      end
    else
      @speed_image = nil
    end
    @speed_image
  end

  def draw
    if @active
      @object_pool.camera.draw_crosshair
    end
    @radar.draw
    offset = 20
    health_image.draw(20, offset, 1000)
    stats_image.draw(20, offset += 30, 1000)
    if fire_rate_image
      fire_rate_image.draw(20, offset += 30, 1000)
    end
    if speed_image
      speed_image.draw(20, offset += 30, 1000)
    end
  end
end
