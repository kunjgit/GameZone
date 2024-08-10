class GameObject
  attr_reader :x, :y, :location, :components
  def initialize(object_pool, x, y)
    @x, @y = x, y
    @location = [x, y]
    @components = []
    @object_pool = object_pool
    @object_pool.add(self)
  end

  def move(new_x, new_y)
    return if new_x == @x && new_y == @y
    @object_pool.tree_remove(self)
    @x = new_x
    @y = new_y
    @location = [new_x, new_y]
    @object_pool.tree_insert(self)
  end

  def update
    @components.map(&:update)
  end

  def draw(viewport)
    @components.each { |c| c.draw(viewport) }
  end

  def removable?
    @removable
  end

  def mark_for_removal
    @removable = true
  end

  def on_collision(object)
  end

  def effect?
    false
  end

  def box
  end

  def collide
  end

  protected

  def object_pool
    @object_pool
  end
end
