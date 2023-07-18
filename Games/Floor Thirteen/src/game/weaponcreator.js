var WeaponCreator = (function() {
  return {
    g: function generate(type, quality) {
      var fireRate, barrelSize;
      var dmg = 1;
      var reloadTime = getRandomInt(8, 12) / 10.0;
      var fullAuto = false;
      var spread = 1;
      // Generate weapon
      type = type < 0 ? getRandomInt(0, 9) : type;
      if (type < 3) {
        // We have a pistol
        type = WEAPON_PISTOL;
        fireRate = getRandomInt(1, 4) / 10;
        dmg = getRandomElement([1, 1, 2, 3]);
        barrelSize = getRandomElement([6, 7, 8, 13]);
        fullAuto = !getRandomInt(0, 20);
      } else if (type < 5) {
        // We have an SMG
        type = WEAPON_SMG;
        fireRate = getRandomInt(8, 30) / 100;
        barrelSize = getRandomElement([25, 25, 30]);
        fullAuto = true;
      } else if (type < 7) {
        // We have a shotgun
        type = WEAPON_SHOTGUN;
        fireRate = getRandomInt(3, 5) / 10;
        dmg = getRandomElement([1, 1, 1, 2, 3]);
        spread = getRandomInt(4, 8);
        reloadTime += spread / 10;
        barrelSize = getRandomElement([3, 5, 7, 8]);
        fullAuto = !getRandomInt(0, 9);
      } else if (type < 9) {
        // We have a rifle
        type = WEAPON_RIFLE;
        fireRate = getRandomInt(12, 35) / 100;
        barrelSize = getRandomElement([25, 30, 30, 35]);
        fullAuto = true;
      } else {
        // We have a sniper
        type = WEAPON_SNIPER;
        fireRate = getRandomInt(7, 14) / 10;
        dmg = getRandomInt(3, 7);
        barrelSize = getRandomInt(2, 5);
      }

      // Adjust quality
      quality = 1 + (quality || 0) / 10.0;
      fireRate /= quality;
      reloadTime /= quality;
      dmg = dmg * quality | 0;
      spread = spread > 1 ? (spread * quality | 0) : spread;

      // Create a weapon component
      var weapon = new Weapon(type, fireRate, dmg, barrelSize, reloadTime, fullAuto, spread);

      if (__PW_DEBUG) {
        console.log(weapon);
      }

      return weapon;
    }
  };
})();
