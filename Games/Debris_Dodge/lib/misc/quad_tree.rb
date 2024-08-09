class QuadTree
  NODE_CAPACITY = 12
  attr_accessor :ne, :nw, :se, :sw, :objects

  def initialize(boundary)
    @boundary = boundary
    @objects = []
  end

  def insert(game_object)
    return false unless @boundary.contains?(
      game_object.location)

    if @objects.size < NODE_CAPACITY
      @objects << game_object
      return true
    end

    subdivide unless @nw

    return true if @nw.insert(game_object)
    return true if @ne.insert(game_object)
    return true if @sw.insert(game_object)
    return true if @se.insert(game_object)

    # should never happen
    raise "Failed to insert #{game_object}"
  end

  def remove(game_object)
    return false unless @boundary.contains?(
      game_object.location)
    if @objects.delete(game_object)
      return true
    end
    return false unless @nw
    return true if @nw.remove(game_object)
    return true if @ne.remove(game_object)
    return true if @sw.remove(game_object)
    return true if @se.remove(game_object)
    false
  end

  def query_range(range)
    result = []
    unless @boundary.intersects?(range)
      return result
    end

    @objects.each do |o|
      if range.contains?(o.location)
        result << o
      end
    end

    # Not subdivided
    return result unless @ne

    result += @nw.query_range(range)
    result += @ne.query_range(range)
    result += @sw.query_range(range)
    result += @se.query_range(range)

    result
  end

  private

  def subdivide
    cx, cy = @boundary.center
    hx, hy = @boundary.half_dimension
    hhx = (cx - hx).abs / 2.0
    hhy = (cy - hy).abs / 2.0
    @nw = QuadTree.new(
      AxisAlignedBoundingBox.new(
        [cx - hhx, cy - hhy],
        [cx, cy]))
    @ne = QuadTree.new(
      AxisAlignedBoundingBox.new(
        [cx + hhx, cy - hhy],
        [cx, cy]))
    @sw = QuadTree.new(
      AxisAlignedBoundingBox.new(
        [cx - hhx, cy + hhy],
        [cx, cy]))
    @se = QuadTree.new(
      AxisAlignedBoundingBox.new(
        [cx + hhx, cy + hhy],
        [cx, cy]))
  end
end
