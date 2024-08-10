class ExplosionGraphics < Component
  FRAME_DELAY = 16.66 # ms

  def initialize(game_object)
    super
    @current_frame = 0
  end

  def draw(viewport)
    image = current_frame
    image.draw(
      x - image.width / 2 + 3,
      y - image.height / 2 - 35,
      20)
  end

  def update
    now = Gosu.milliseconds
    delta = now - (@last_frame ||= now)
    if delta > FRAME_DELAY
      @last_frame = now
    end
    @current_frame += (delta / FRAME_DELAY).floor
    object.mark_for_removal if done?
  end

  private

  def current_frame
    animation[@current_frame % animation.size]
  end

  def done?
    @done ||= @current_frame >= animation.size
  end

  def animation
    @@animation ||=
    Gosu::Image.load_tiles(
      $window, Utils.media_path('explosion.png'),
      128, 128, false)
  end
end
