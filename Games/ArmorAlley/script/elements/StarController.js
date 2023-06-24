import { game } from '../core/Game.js';
import { TYPES, isMobile, rndInt, searchParams, worldHeight } from '../core/global.js';

const StarController = () => {

  // "Star Control" (star controller.) Ideally, version ][ of course. ;)
  let data, exports;

  data = {
    starCount: parseInt(searchParams.get('stars'), 10) || (isMobile ? 384 : 256)
  };

  function initStars() {

    const topOffset = 16;

    const xMax = game.objects.view.data.browser.width;

    const yMax = worldHeight - (topOffset * 1.25);

    for (let i = 0, j = data.starCount; i < j; i++) {
      game.addObject(TYPES.star, {
        x: rndInt(xMax),
        y: topOffset + rndInt(yMax - (topOffset * 2))
      });
    }

  }

  function resetStars() {

    game.objects.star.forEach((star) => star.reset());

  }

  exports = {
    data,
    init: initStars,
    reset: resetStars
  };

  return exports;

}

export { StarController };