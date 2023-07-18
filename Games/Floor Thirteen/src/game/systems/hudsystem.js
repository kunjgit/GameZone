/**
 * Render HUD.
 *
 * @param {DisplayObjectContainer} layer
 */
function HUDSystem(layer) {
  System.call(this);

  function createBigBox(width) {
    var box = new DisplayObjectContainer();
    var left, bg, right;

    // Left border
    left = box.a(new Sprite(__textureManager.g('bl')));

    // Background
    bg = box.a(new Sprite(__textureManager.g('bb')));
    bg.x = left.tx.f.w;
    bg.sx = width;

    // Right corner
    right = box.a(new Sprite(__textureManager.g('br')));
    right.x = bg.x + width;

    return box;
  }

  function createTextBox(width) {
    var box = new DisplayObjectContainer();
    var bg, right;

    // Background
    bg = box.a(new Sprite(__textureManager.g('tb')));
    bg.sx = width;

    // Right corner
    right = box.a(new Sprite(__textureManager.g('tr')));
    right.x = width;

    return box;
  }

  var container = layer.a(new DisplayObjectContainer());

  container.x = 131;
  container.y = 160;

  var weaponBox = container.a(createBigBox(14));
  var healthBox = container.a(createBigBox(6));
  var bulletBox = container.a(createBigBox(6));

  weaponBox.x = 0;
  bulletBox.x = 25;
  healthBox.x = 79;
  weaponBox.y = healthBox.y = bulletBox.y = 0;

  var healthTextBox = healthBox.a(createTextBox(9));
  var bulletTextBox = bulletBox.a(createTextBox(32));

  healthTextBox.x = bulletTextBox.x = 14;
  healthTextBox.y = bulletTextBox.y = 3;

  var heart = healthBox.a(new Sprite(__textureManager.g('hh')));
  var bullet = bulletBox.a(new Sprite(__textureManager.g('hb')));

  heart.x = bullet.x = 2;
  heart.y = 5;
  bullet.y = 4;

  var healthText = healthBox.a(new BitmapText());
  var bulletText = bulletBox.a(new BitmapText());

  healthText.x = bulletText.x = 15;
  healthText.y = 6;
  bulletText.y = 6;

  var weaponIcon = weaponBox.a(new Sprite(__textureManager.g('w0')));

  weaponIcon.x = 11;
  weaponIcon.y = 9;
  weaponIcon.c.x = weaponIcon.c.y = 0.5;

  __mixin(this, System.prototype);
  __mixin(this, {
    u: function update() {
      var player = __tm.g(TAG_PLAYER);
      if (!player) {
        healthText.t(0);
        return;
      }

      var health = player.g(Health);
      var weapon = player.g(Weapon);

      // Update weapon
      weaponIcon.tx = __textureManager.g('w' + weapon.t)[0];
      bulletText.t(weapon.b + ' / ' + weapon.bs);

      // Update health
      healthText.t(health.h);
    }
  });
}
