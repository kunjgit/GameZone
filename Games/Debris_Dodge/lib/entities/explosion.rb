class Explosion < GameObject

  def initialize(object_pool, x, y, source)
    super(object_pool, x, y)
    @source = source
    @object_pool = object_pool
    if @object_pool.map.can_move_to?(x, y)
      Damage.new(@object_pool, x, y)
    end
    ExplosionGraphics.new(self)
    ExplosionSounds.play(self, object_pool.camera)
    inflict_damage
  end

  def effect?
    true
  end

  def mark_for_removal
    super
  end

  private

  def inflict_damage
    object_pool.nearby(self, 100).each do |obj|
      if obj.respond_to?(:health)
        obj.health.inflict_damage(
          Math.sqrt(3 * 100 - Utils.distance_between(
              obj.x, obj.y, @x, @y)), @source)
      end
    end
  end
end
