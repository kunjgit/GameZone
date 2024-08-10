class PlayState < GameState
  attr_accessor :update_interval, :object_pool, :tank

  def initialize
    # http://www.paulandstorm.com/wha/clown-names/
    @names = Names.new(
      Utils.media_path('names.txt'))
    @object_pool = ObjectPool.new(Map.bounding_box)
    @map = Map.new(@object_pool)
    @camera = Camera.new
    @object_pool.camera = @camera
    create_tanks(7)
  end

  def update
    StereoSample.cleanup
    @object_pool.update_all
    @camera.update
    @hud.update
    update_caption
  end

  def draw
    cam_x = @camera.x
    cam_y = @camera.y
    off_x =  $window.width / 2 - cam_x
    off_y =  $window.height / 2 - cam_y
    viewport = @camera.viewport
    x1, x2, y1, y2 = viewport
    box = AxisAlignedBoundingBox.new(
      [x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2],
      [x1 - Map::TILE_SIZE, y1 - Map::TILE_SIZE])
    $window.translate(off_x, off_y) do
      zoom = @camera.zoom
      $window.scale(zoom, zoom, cam_x, cam_y) do
        @map.draw(viewport)
        @object_pool.query_range(box).map do |o|
          o.draw(viewport)
        end
      end
    end
    @hud.draw
  end

  def button_down(id)
    if id == Gosu::KbEscape
      pause = PauseState.instance
      pause.play_state = self
      GameState.switch(pause)
    end
    if id == Gosu::KbT
      t = Tank.new(@object_pool,
        AiInput.new(@names.random, @object_pool))
      t.move(*@camera.mouse_coords)
    end
    if id == Gosu::KbF1
      $debug = !$debug
    end
    if id == Gosu::KbF2
      toggle_profiling
    end
    if id == Gosu::KbR
      @tank.mark_for_removal
      @tank = Tank.new(@object_pool,
        PlayerInput.new('Player', @camera, @object_pool))
      @camera.target = @tank
      @hud.player = @tank
    end
  end

  def leave
    StereoSample.stop_all
    if @profiling_now
      toggle_profiling
    end
    @hud.active = false
  end

  def enter
    @hud.active = true
  end

  private

  def create_tanks(amount)
    @map.spawn_points(amount * 3)
    @tank = Tank.new(@object_pool,
      PlayerInput.new('Player', @camera, @object_pool))
    amount.times do |i|
      Tank.new(@object_pool, AiInput.new(
        @names.random, @object_pool))
    end
    @camera.target = @tank
    @hud = HUD.new(@object_pool, @tank)
  end

  def toggle_profiling
    require 'ruby-prof' unless defined?(RubyProf)
    if @profiling_now
      result = RubyProf.stop
      printer = RubyProf::FlatPrinter.new(result)
      printer.print(STDOUT, min_percent: 0.01)
      @profiling_now = false
    else
      RubyProf.start
      @profiling_now = true
    end
  end

  def update_caption
    now = Gosu.milliseconds
    if now - (@caption_updated_at || 0) > 1000
      $window.caption = 'Tank Island. ' <<
        "[FPS: #{Gosu.fps}. " <<
        "Tank @ #{@tank.x.round}:#{@tank.y.round}]"
      @caption_updated_at = now
    end
  end
end
