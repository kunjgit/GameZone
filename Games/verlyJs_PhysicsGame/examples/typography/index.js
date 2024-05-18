/**
 * Verlet Typography
 * @author <hazru.anurag@gmail.com>
 */

window.onload = function () {
  let canvas = document.getElementById('c');
  let ctx = canvas.getContext('2d');
  let width = clamp(window.innerWidth, 1200, Infinity);
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  let verly = new Verly(50, canvas, ctx);

  // URL = undefined;

  let urlText = 'HAPPY';
  let urlText2 = 'HOLI';
  // check support
  if ('URL' in window && URL !== undefined) {
    let url = new URL(window.location.href);
    let query_string = url.search;
    let search_params = new URLSearchParams(query_string);
    urlText = search_params.get('text') || 'HAPPY';
    urlText2 = search_params.get('text2') || 'HOLI';
  }

  let word = new Text(urlText, 50, 100, 25, verly);
  let word2 = new Text(urlText2, 700, 100, 25, verly);

  // let A = new TypoGraphy(offsetX, center, 20, 'A');

  verly.addEntity(word.entity);
  verly.addEntity(word2.entity);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    verly.update();
    verly.render();
    verly.interact();
    // word.entity.renderPointsIndex()
    // verly.renderPointIndex();
    // word.entity.renderPointIndex();

    requestAnimationFrame(animate);
  }
  animate();
}