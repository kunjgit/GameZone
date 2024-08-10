class AxisAlignedBoundingBox
  attr_reader :center, :half_dimension
  def initialize(center, half_dimension)
    @center = center
    @half_dimension = half_dimension
    @dhx = (@half_dimension[0] - @center[0]).abs
    @dhy = (@half_dimension[1] - @center[1]).abs
  end

  def contains?(point)
    return false unless (@center[0] + @dhx) >= point[0]
    return false unless (@center[0] - @dhx) <= point[0]
    return false unless (@center[1] + @dhy) >= point[1]
    return false unless (@center[1] - @dhy) <= point[1]
    true
  end

  def intersects?(other)
    ocx, ocy = other.center
    ohx, ohy = other.half_dimension
    odhx = (ohx - ocx).abs
    return false unless (@center[0] + @dhx) >= (ocx - odhx)
    return false unless (@center[0] - @dhx) <= (ocx + odhx)
    odhy = (ohy - ocy).abs
    return false unless (@center[1] + @dhy) >= (ocy - odhy)
    return false unless (@center[1] - @dhy) <= (ocy + odhy)
    true
  end

  def to_s
    "c: #{@center}, h: #{@half_dimension}"
  end
end
