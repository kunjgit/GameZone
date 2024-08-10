class PowerupGraphics < Component
  def initialize(object, type)
    super(object)
    @type = type
  end

  def draw(viewport)
    image.draw(x - 12, y - 12, 1)
    Utils.mark_corners(object.box) if $debug
  end

  private

  def image
    @image ||= images.frame("#{@type}.png")
  end

  def images
    @@images ||= Gosu::TexturePacker.load_json(
      Utils.media_path('pickups.json'))
  end
end
