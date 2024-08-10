class Bullet < GameObject
  attr_accessor :target_x, :target_y, :source, :speed, :fired_at

  def initialize(object_pool, source_x, source_y, target_x, target_y)
    super(object_pool, source_x, source_y)
    @target_x, @target_y = target_x, target_y
    BulletPhysics.new(self, object_pool)
    BulletGraphics.new(self)
    BulletSounds.play(self, object_pool.camera)
  end

  def box
    [@x, @y]
  end

  def explode
    Explosion.new(object_pool, @x, @y, @source)
    mark_for_removal
  end

  def fire(source, speed)
    @source = source
    @speed = speed
    @fired_at = Gosu.milliseconds
  end
end
