class TankGraphics < Component
  def initialize(game_object)
    super(game_object)
    @body_normal = units.frame('tank1_body.png')
    @shadow_normal = units.frame('tank1_body_shadow.png')
    @gun_normal = units.frame('tank1_dualgun.png')
    @body_dead = units.frame('tank1_body_destroyed.png')
    @shadow_dead = units.frame('tank1_body_destroyed_shadow.png')
    @gun_dead = nil
    update
  end

  def update
    if object && object.health.dead?
      @body = @body_dead
      @gun = @gun_dead
      @shadow = @shadow_dead
    else
      @body = @body_normal
      @gun = @gun_normal
      @shadow = @shadow_normal
    end
  end

  def draw(viewport)
    @shadow.draw_rot(x - 1, y - 1, 0, object.direction)
    @body.draw_rot(x, y, 1, object.direction)
    @gun.draw_rot(x, y, 2, object.gun_angle) if @gun
    Utils.mark_corners(object.box) if $debug
  end

  def width
    @body.width
  end

  def height
    @body.height
  end

  private

  def units
    @@units = Gosu::TexturePacker.load_json(
      Utils.media_path('ground_units.json'), :precise)
  end
end
