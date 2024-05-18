import {
  random,
  radians,
  degrees,
  clamp,
  normalizedRandom,
  lerp
} from './Utils';

import Verly from './Verly';
import Vector from './Vector';
import Point from './Point';
import Stick from './Stick';
import AngleStick from './AngleStick';
import Entity from './Entity';
import TypoGraphy from './TypoGraphy';

window.Verly = Verly;
window.Vector = Vector;
window.Point = Point;
window.Stick = Stick;
window.AngleStick = AngleStick;
window.Entity = Entity;
window.TypoGraphy = TypoGraphy;

// utils
window.random = random;
window.radians = radians;
window.degrees = degrees;
window.clamp = clamp;
window.normalizedRandom = normalizedRandom;
window.lerp = lerp;

export default Verly;