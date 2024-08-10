class BoxGraphics < Component
  def initialize(object)
    super(object)
    load_sprite
  end

  def draw(viewport)
    @box.draw_rot(x, y, 0, object.angle)
    Utils.mark_corners(object.box) if $debug
  end

  def height
    @box.height
  end

  def width
    @box.width
  end

  private

  def load_sprite
    frame = boxes.frame_list.sample
    @box = boxes.frame(frame)
  end

  def center_x
    @center_x ||= x - width / 2
  end

  def center_y
    @center_y ||= y - height / 2
  end

  def boxes
    @@boxes ||= Gosu::TexturePacker.load_json(
      Utils.media_path('boxes_barrels.json'))
  end
end
