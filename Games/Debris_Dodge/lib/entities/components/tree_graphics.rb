class TreeGraphics < Component
  SHAKE_TIME = 100
  SHAKE_COOLDOWN = 200
  SHAKE_DISTANCE = [2, 1, 0, -1, -2, -1, 0, 1, 0, -1, 0]
  def initialize(object, seed)
    super(object)
    load_sprite(seed)
  end

  def shake(direction)
    now = Gosu.milliseconds
    return if @shake_start &&
      now - @shake_start < SHAKE_TIME + SHAKE_COOLDOWN
    @shake_start = now
    @shake_direction = direction
    @shaking = true
  end

  def adjust_shake(x, y, shaking_for)
    elapsed = [shaking_for, SHAKE_TIME].min / SHAKE_TIME.to_f
    frame = ((SHAKE_DISTANCE.length - 1) * elapsed).floor
    distance = SHAKE_DISTANCE[frame]
    Utils.point_at_distance(x, y, @shake_direction, distance)
  end

  def draw(viewport)
    if @shaking
      shaking_for = Gosu.milliseconds - @shake_start
      shaking_x, shaking_y = adjust_shake(
        center_x, center_y, shaking_for)
      @tree.draw(shaking_x, shaking_y, 5)
      if shaking_for >= SHAKE_TIME
        @shaking = false
      end
    else
      @tree.draw(center_x, center_y, 5)
    end
    Utils.mark_corners(object.box) if $debug
  end

  def height
    @tree.height
  end

  def width
    @tree.width
  end

  private

  def load_sprite(seed)
    frame_list = trees.frame_list
    frame = frame_list[(frame_list.size * seed).round]
    @tree = trees.frame(frame)
  end

  def center_x
    @center_x ||= x - @tree.width / 2
  end

  def center_y
    @center_y ||= y - @tree.height / 2
  end

  def trees
    @@trees ||= Gosu::TexturePacker.load_json(
      Utils.media_path('trees_packed.json'))
  end
end
