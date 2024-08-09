class Map
  MAP_WIDTH = 30
  MAP_HEIGHT = 30
  TILE_SIZE = 128

  def self.bounding_box
    center = [MAP_WIDTH * TILE_SIZE / 2,
              MAP_HEIGHT * TILE_SIZE / 2]
    half_dimension = [MAP_WIDTH * TILE_SIZE,
                      MAP_HEIGHT * TILE_SIZE]
    AxisAlignedBoundingBox.new(center, half_dimension)
  end

  def initialize(object_pool)
    load_tiles
    @object_pool = object_pool
    object_pool.map = self
    @map = generate_map
    generate_trees
    generate_boxes
    generate_powerups
  end

  def spawn_points(max)
    @spawn_points = (0..max).map do
      find_spawn_point
    end
    @spawn_points_pointer = 0
  end

  def spawn_point
    @spawn_points[(@spawn_points_pointer += 1) % @spawn_points.size]
  end

  def can_move_to?(x, y)
    tile = tile_at(x, y)
    tile && tile != @water
  end

  def movement_penalty(x, y)
    tile = tile_at(x, y)
    case tile
    when @sand
      0.33
    else
      0
    end
  end

  def draw(viewport)
    viewport = viewport.map { |p| p / TILE_SIZE }
    x0, x1, y0, y1 = viewport.map(&:to_i)
    (x0-1..x1).each do |x|
      (y0-1..y1).each do |y|
        row = @map[x]
        map_x = x * TILE_SIZE
        map_y = y * TILE_SIZE
        if row
          tile = @map[x][y]
          if tile
            tile.draw(map_x, map_y, 0)
          else
            @water.draw(map_x, map_y, 0)
          end
        else
          @water.draw(map_x, map_y, 0)
        end
      end
    end
  end

  private

  def tile_at(x, y)
    t_x = ((x / TILE_SIZE) % TILE_SIZE).floor
    t_y = ((y / TILE_SIZE) % TILE_SIZE).floor
    row = @map[t_x]
    row ? row[t_y] : @water
  end

  def load_tiles
    tiles = Gosu::Image.load_tiles(
      $window, Utils.media_path('ground.png'),
      128, 128, true)
    @sand = tiles[0]
    @grass = tiles[8]
    @water = Gosu::Image.new(
      Utils.media_path('water.png'), tileable: true)
  end

  def generate_map
    noises = Perlin::Noise.new(2)
    contrast = Perlin::Curve.contrast(
      Perlin::Curve::CUBIC, 2)
    map = {}
    MAP_WIDTH.times do |x|
      map[x] = {}
      MAP_HEIGHT.times do |y|
        n = noises[x * 0.1, y * 0.1]
        n = contrast.call(n)
        map[x][y] = choose_tile(n)
      end
    end
    map
  end

  def generate_trees
    noises = Perlin::Noise.new(2)
    contrast = Perlin::Curve.contrast(
      Perlin::Curve::CUBIC, 2)
    trees = 0
    target_trees = rand(1500..1500)
    while trees < target_trees do
      x = rand(0..MAP_WIDTH * TILE_SIZE)
      y = rand(0..MAP_HEIGHT * TILE_SIZE)
      n = noises[x * 0.001, y * 0.001]
      n = contrast.call(n)
      if tile_at(x, y) == @grass && n > 0.5
        Tree.new(@object_pool, x, y, n * 2 - 1)
        trees += 1
      end
    end
  end

  def generate_boxes
    boxes = 0
    target_boxes = rand(50..200)
    while boxes < target_boxes do
      x = rand(0..MAP_WIDTH * TILE_SIZE)
      y = rand(0..MAP_HEIGHT * TILE_SIZE)
      if tile_at(x, y) != @water
        Box.new(@object_pool, x, y)
        boxes += 1
      end
    end
  end

  def generate_powerups
    pups = 0
    target_pups = rand(20..30)
    while pups < target_pups do
      x = rand(0..MAP_WIDTH * TILE_SIZE)
      y = rand(0..MAP_HEIGHT * TILE_SIZE)
      if tile_at(x, y) != @water &&
          @object_pool.nearby_point(x, y, 150).empty?
        random_powerup.new(@object_pool, x, y)
        pups += 1
      end
    end
  end

  def random_powerup
    [HealthPowerup,
     RepairPowerup,
     FireRatePowerup,
     TankSpeedPowerup].sample
  end

  def choose_tile(val)
    case val
    when 0.0..0.3 # 30% chance
      @water
    when 0.3..0.5 # 20% chance, water edges
      @sand
    else # 50% chance
      @grass
    end
  end

  private

  def find_spawn_point
    while true
      x = rand(0..MAP_WIDTH * TILE_SIZE)
      y = rand(0..MAP_HEIGHT * TILE_SIZE)
      if can_move_to?(x, y) &&
          @object_pool.nearby_point(x, y, 150).empty?
        return [x, y]
      end
    end
  end

end
