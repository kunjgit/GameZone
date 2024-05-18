import { should } from 'chai';
import { expect } from 'chai';
should();

import {
  random,
  radians,
  degrees,
  clamp,
  normalizedRandom,
  lerp
} from '../src/Utils.js';

describe('Utils', function () {
  describe('random()', function () {
    it('should return a random value', function () {
      random().should.be.a('number');
    });
    it('should return a random value between 1 and 10', function () {
      for (let i = 0; i < 5; i++) {
        expect(random(1, 10)).to.below(10).above(1);
      }
    });
    it('should return a random value between negative -100 and 100', function () {
      for (let i = 0; i < 5; i++) {
        expect(random(-100, 100)).to.below(100).above(-100);
      }
    });
  });

  describe('radians()', function () {
    it('should return a number', function () {
      radians(10).should.be.a('number');
    });
    it('should convert degrees to radians', function () {
      expect(radians(30)).to.be.closeTo(0.523599, 0.1);
      expect(radians(90)).to.be.closeTo(1.5708, 0.1);
      expect(radians(180)).to.be.closeTo(3.14159, 0.1);
    });
  });

  describe('degrees()', function () {
    it('should return a number', function () {
      degrees(10).should.be.a('number');
    });
    it('should convert radians to degrees', function () {
      expect(degrees(0.523599)).to.be.closeTo(30, 0.1);
      expect(degrees(1.5708)).to.be.closeTo(90, 0.1);
      expect(degrees(3.14159)).to.be.closeTo(180, 0.1);
    });
  });


  describe('clamp()', function () {
    it('should return a number', function () {
      clamp(10).should.be.a('number');
    });
    it('should clamp the value between some limits', function () {
      expect(clamp(0, 100, 1000)).to.below(999).above(99);
      expect(clamp(0, -1000, 100)).to.below(99).above(-999);
      expect(clamp(0, 150, 650)).to.below(649).above(149);
    });
  });
});