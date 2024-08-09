class Damage < GameObject
  MAX_INSTANCES = 300
  @@instances = []

  def initialize(object_pool, x, y)
    super
    DamageGraphics.new(self)
    track(self)
  end

  def effect?
    true
  end

  private

  def track(instance)
    if @@instances.size < MAX_INSTANCES
      @@instances << instance
    else
      out = @@instances.shift
      out.mark_for_removal
      @@instances << instance
    end
  end
end
