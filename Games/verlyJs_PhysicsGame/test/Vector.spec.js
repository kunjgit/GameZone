import { should } from 'chai';
import { expect } from 'chai';
should();

import Vector from '../src/Vector.js';

describe('Vector', function () {
  describe('Vector()', function () {
    it('should initialize Vector', function () {
      let vec = new Vector();
      vec.should.have.property('x');
      vec.should.have.property('y');
      vec.x.should.be.a('number');
      vec.y.should.be.a('number');
      expect(vec.x).to.equal(0);
      expect(vec.y).to.equal(0);
    })

    it('should initialize Vector with parameters', function () {
      let vec = new Vector(100, 100);
      expect(vec.x).to.equal(100);
      expect(vec.y).to.equal(100);
    })

    it('#setXY should set X and Y', function () {
      let vec = new Vector(100, 100);
      vec.setXY(512, 210)
      expect(vec.x).to.equal(512);
      expect(vec.y).to.equal(210);
    })

    it('#sub-static', function () {
      let vec1 = new Vector(100, 100);
      let vec2 = new Vector(100, 100);
      let sub = Vector.sub(vec1, vec2);
      sub.should.be.instanceOf(Vector);
      expect(sub.x).to.equal(0);
      expect(sub.y).to.equal(0);
    })

    it('#add-static', function () {
      let vec1 = new Vector(100, 100);
      let vec2 = new Vector(100, 100);
      let add = Vector.add(vec1, vec2);
      add.should.be.instanceOf(Vector);
      expect(add.x).to.equal(200);
      expect(add.y).to.equal(200);
    })

    it('#fromAngle-static', function () {
      let vec = Vector.fromAngle(30);
      vec.should.be.instanceOf(Vector);
      vec.x.should.be.a('number');
      vec.y.should.be.a('number');
    })

    it('#random2D-static', function () {
      let vec = Vector.random2D(30);
      vec.should.be.instanceOf(Vector);
      vec.x.should.be.a('number');
      vec.y.should.be.a('number');
    })

    it('#add should add a vector to itself', function () {
      let vec = new Vector(100, 100);
      vec.add(new Vector(100, 100));
      expect(vec.x).to.equal(200);
      expect(vec.y).to.equal(200);
      vec.add(100, 100);
      expect(vec.x).to.equal(300);
      expect(vec.y).to.equal(300);
    })

    it('#sub should subtract a vector to itself', function () {
      let vec = new Vector(300, 300);
      vec.sub(new Vector(100, 100));
      expect(vec.x).to.equal(200);
      expect(vec.y).to.equal(200);
      vec.sub(100, 100);
      expect(vec.x).to.equal(100);
      expect(vec.y).to.equal(100);
    })

    it('#mult should multiply a vector to itself or a scalar value', function () {
      let vec = new Vector(100, 100);
      vec.mult(new Vector(2, 2));
      expect(vec.x).to.equal(200);
      expect(vec.y).to.equal(200);
      vec.mult(2);
      expect(vec.x).to.equal(400);
      expect(vec.y).to.equal(400);
    })

    it('#div should divide a vector to itself or a scalar value', function () {
      let vec = new Vector(200, 200);
      vec.div(new Vector(2, 2));
      expect(vec.x).to.equal(100);
      expect(vec.y).to.equal(100);
      vec.div(2);
      expect(vec.x).to.equal(50);
      expect(vec.y).to.equal(50);
    })

    it('#limit should limit the vector', function () {
      let vec = new Vector(-100, 200);
      vec.limit(100);
      expect(vec.mag()).to.closeTo(100, 0.1);
    })

    it('#dist should return distance between given vector', function () {
      let vec1 = new Vector(100, 200);
      let vec2 = new Vector(200, 200);
      let dist = vec1.dist(vec2);
      expect(dist).to.be.equal(100);
      vec1 = new Vector(150, 200);
      vec2 = new Vector(200, 200);
      dist = vec1.dist(vec2);
      expect(dist).to.be.equal(50);
    })

    it('#distSq should return sqr distance between given vector', function () {
      let vec1 = new Vector(100, 200);
      let vec2 = new Vector(200, 200);
      let dist = vec1.distSq(vec2);
      expect(dist).to.be.equal(10000);
      vec1 = new Vector(150, 200);
      vec2 = new Vector(200, 200);
      dist = vec1.distSq(vec2);
      expect(dist).to.be.equal(2500);
    })

    it('#negative should negate the vector', function () {
      let vec1 = new Vector(100, 200).negative();
      expect(vec1.x).to.be.equal(-100);
      expect(vec1.y).to.be.equal(-200);
    })

  })
});