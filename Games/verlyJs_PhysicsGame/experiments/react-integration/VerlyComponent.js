/**
 * Verly.js
 * https://github.com/anuraghazra/Verly.js
 *
 * @author <http://anuraghazra.github.io>
 *
 * this integration is still in beta, i'm experimenting with it
 *
 * give Verly.js a Star on github if you liked it
 */
import React, { useState, useEffect, useRef } from 'react';

// rect
export function Rect({ verly, x, y, width, height }) {
  verly.createBox(x, y, width, height);
  return null;
}

// rope
export function Rope({ verly, x, y, segs, gap, pin }) {
  verly.createRope(x, y, segs, gap, pin);
  return null;
}

// cloth
export function Cloth({ verly, x, y, width, height, segs, pin }) {
  verly.createCloth(x, y, width, height, segs, pin);
  return null;
}

// hexagon
export function Hexagon({ verly, x, y, segs, radius, stride1, stride2 }) {
  verly.createHexagon(x, y, segs, radius, stride1, stride2);
  return null;
}

//ragdoll
export function Ragdoll({ verly, x, y }) {
  verly.createRagdoll(x, y);
  return null;
}

// VerlyEntity
export function VerlyEntity({ verly, children }) {
  let entity = new Entity(verly.iterations, verly);
  let childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, { entity: entity })
  );
  verly.addEntity(entity);
  return childrenWithProps;
}

// Point
export function Point({ entity, x, y }) {
  entity.addPoint(x, y);
  return null;
}

// Stick
export function Stick({ entity, indices }) {
  entity.addStick(indices[0], indices[1]);
  return null;
}

// VerlyStage
export function VerlyStage({ width, height, iterations, children }) {
  let canvasRef = useRef();
  let [verly, setVerly] = useState(null);
  let [childrenWithProps, setChilds] = useState(null);

  useEffect(() => {
    let canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    let verly = new Verly(iterations, canvas, ctx);
    // verly.createBox(100, 100, 100, 100);
    setVerly(verly);
    let childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { verly: verly })
    );
    setChilds(childrenWithProps);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      verly.update();
      verly.render();
      verly.interact();

      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return <canvas ref={canvasRef}>{childrenWithProps}</canvas>;
}
