function GameScreen() {
  // Create game layers
  var stage = new Stage();
  var cameraLayer = stage.a(new DisplayObjectContainer());
  var hudLayer    = stage.a(new DisplayObjectContainer());
  var gameLayer   = cameraLayer.a(new DisplayObjectContainer());

  // Initialize game systems
  __sm.a(new KeyboardControlSystem());
  __sm.a(new PathFollowSystem());
  __sm.a(new MovementSystem());
  __sm.a(new DungeonCollisionSystem());
  __sm.a(new EntityCollisionSystem());
  __sm.a(new CameraSystem(cameraLayer));

  if (__PW_DEBUG) {
    var debugLayer = cameraLayer.a(new DisplayObjectContainer());
    __sm.a(new BoundsRendererSystem(debugLayer));
  }

  __sm.a(new SpriteDirectionSystem());
  __sm.a(new SpriteRendererSystem(gameLayer));
  __sm.a(new LifetimeSystem());

  // Generate world
  var dungeon = EntityCreator.dungeon();
  var map = Pixelwars.c(dungeon, Dungeon.name);

  // Initialize path finder
  AStar.init(map.m, isWallTile);

  // Create game
  var game = EntityCreator.game(cameraLayer);

  // Create player
  var player = EntityCreator.player(map.p);

  // Create doors
  for (i = map.d.length; i--;) {
    EntityCreator.door(map.d[i]);
  }

  // Create enemies
  for (i = map.e.length; i--;) {
    EntityCreator.skeleton(map.e[i]);
  }

  EntityCreator.entrance(map.p);
  EntityCreator.exit(map.n);

  // Run the game
  __sm.start();

  __mixin(this, {
    c: function clear() {
      Buffer.clear();
      __sm.stop();
      __sm.c();
      __evt.c();
      __em.c();
    }
  });
}
