class ScoreDisplay
  def initialize(object_pool, font_size=30)
    @font_size = font_size
    tanks = object_pool.objects.select do |o|
      o.class == Tank
    end
    stats = tanks.map(&:input).map(&:stats)
    stats.sort! do |stat1, stat2|
      stat2.kills <=> stat1.kills
    end
    create_stats_image(stats)
  end

  def create_stats_image(stats)
    text = stats.map do |stat|
      "#{stat.kills}: #{stat.name} "
    end.join("\n")
    @stats_image = Gosu::Image.from_text(
      $window, text, Utils.main_font, @font_size)
  end

  def draw
    @stats_image.draw(
      $window.width / 2 - @stats_image.width / 2,
      $window.height / 4 + 30,
      1000)
  end

  def draw_top_right
    @stats_image.draw(
      $window.width - @stats_image.width - 20,
      20,
      1000)
  end
end
