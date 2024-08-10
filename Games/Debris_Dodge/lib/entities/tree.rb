class Tree < GameObject
  attr_reader :health, :graphics

  def initialize(object_pool, x, y, seed)
    super(object_pool, x, y)
    @graphics = TreeGraphics.new(self, seed)
    @health = Health.new(self, object_pool, 30, false)
    @angle = rand(-15..15)
  end

  def on_collision(object)
    @graphics.shake(object.direction)
  end

  def box
    [@x, @y]
  end
end
