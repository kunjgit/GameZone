window.camera = (() => {
  let position = new V();
  let to = new V();

  return {
    reset: () => {
      const characterPosition = character.position();

      position.apply(new V(characterPosition.x - (gc.res.x / 2), characterPosition.y - (gc.res.y / 2)));

      if (position.x < 0) {
        position.x = 0;
      }

      if (position.x + gc.res.x > map.getEnd().x + 40) {
        position.x = map.getEnd().x + 40 - gc.res.x;
      }

      if (position.y < 0) {
        position.y = 0;
      }
    },
    n: () => {
      const characterPosition = character.position();

      to.apply(new V(characterPosition.x - (gc.res.x / 2), characterPosition.y - (gc.res.y / 2)));

      if (to.x < 0) {
        to.x = 0;
      }

      if (to.x + gc.res.x > map.getEnd().x + 40) {
        to.x = map.getEnd().x + 40 - gc.res.x;
      }

      if (to.y < 0) {
        to.y = 0;
      }
      position.add(to.get().sub(position).mult(.05));
    },
    r: () => {
      c.translate(-position.x, -position.y);
    },
    getPosition: () => position
  };
})();
