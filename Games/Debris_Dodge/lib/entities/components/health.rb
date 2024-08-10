class Health < Component
  attr_accessor :health

  def initialize(object, object_pool, health, explodes)
    super(object)
    @explodes = explodes
    @object_pool = object_pool
    @initial_health = @health = health
    @health_updated = true
  end

  def restore
    @health = @initial_health
    @health_updated = true
  end

  def increase(amount)
    @health = [@health + 25, @initial_health * 2].min
    @health_updated = true
  end

  def damaged?
    @health < @initial_health
  end

  def dead?
    @health < 1
  end

  def update
    update_image
  end

  def inflict_damage(amount, cause)
    if @health > 0
      @health_updated = true
      if object.respond_to?(:input)
        object.input.stats.add_damage(amount)
        # Don't count damage to trees and boxes
        if cause.respond_to?(:input) && cause != object
          cause.input.stats.add_damage_dealt(amount)
        end
      end
      @health = [@health - amount.to_i, 0].max
      after_death(cause) if dead?
    end
  end

  def draw(viewport)
    return unless draw?
    @image && @image.draw(
      x - @image.width / 2,
      y - object.graphics.height / 2 -
      @image.height, 100)
  end

  protected

  def draw?
    $debug
  end

  def update_image
    return unless draw?
    if @health_updated
      text = @health.to_s
      font_size = 18
      @image = Gosu::Image.from_text(
          text,
          font_size, font: Gosu.default_font_name)
      @health_updated = false
    end
  end

  def after_death(cause)
    if @explodes
      Thread.new do
        sleep(rand(0.1..0.3))
        Explosion.new(@object_pool, x, y, cause)
        sleep 0.3
        object.mark_for_removal
      end
    else
      object.mark_for_removal
    end
  end
end
