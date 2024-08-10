import 'dart:ui';

import 'package:flame/components/component.dart';
import 'package:galaxygame/dragon.dart';
import 'package:galaxygame/explosion.dart';
import 'package:galaxygame/main.dart';

class Bullet extends SpriteComponent {
  bool explode = false;
  double maxY;
  List<Dragon> dragonList = <Dragon>[];
  List<Bullet> bulletList = <Bullet>[];
  Bullet(this.dragonList, this.bulletList)
      : super.square(BULLET_SIZE, 'gun.png');

  @override
  void update(double t) {
    y -= gameOver ? 0 : t * BULLETSPEED;

    if (dragonList.isNotEmpty)
      dragonList.forEach((dragon) {
        bool remove = this.toRect().contains(dragon.toRect().bottomCenter) ||
            this.toRect().contains(dragon.toRect().bottomLeft) ||
            this.toRect().contains(dragon.toRect().bottomRight);
        if (remove) {
          points += 1;
          dragon.explode = true;
          bullet.explode = true;
          dragonList.remove(dragon);
          game.add(new Explosion(dragon));
        }
      });
  }

  @override
  bool destroy() {
    if (explode) {
      return true;
    }
    if (y == null || maxY == null) {
      return false;
    }
    bool destroy = y >= maxY;

    return destroy;
  }

  @override
  void resize(Size size) {
    this.x = touchPositionDx;
    this.y = touchPositionDy;
    this.maxY = size.height;
  }
}
