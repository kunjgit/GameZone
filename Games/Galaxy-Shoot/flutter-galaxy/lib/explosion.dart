import 'package:flame/components/animation_component.dart';
import 'package:galaxygame/dragon.dart';
import 'package:galaxygame/main.dart';

class Explosion extends AnimationComponent {
  static const TIME = 0.75;

  Explosion(Dragon dragon)
      : super.sequenced(DRAGON_SIZE, DRAGON_SIZE, 'explosion-4.png', 7,
            textureWidth: 31.0, textureHeight: 31.0) {
    this.x = dragon.x;
    this.y = dragon.y;
    this.animation.stepTime = TIME / 7;
  }

  bool destroy() {
    return this.animation.isLastFrame;
  }
}
