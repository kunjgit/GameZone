import { TYPES } from './global.js';
import { sprites } from './sprites.js';

const nodePool = {};
const DEFAULT_POOL_SIZE = 16;

/**
 * Retain and recycle certain kinds of sprites - all GPU, no paint.
 * This means keeping pooled nodes in the DOM, hiding via opacity when not active.
 */
const nodePoolConfig = [
  { type: TYPES.smoke },
  { type: TYPES.gunfire }
];

nodePoolConfig.forEach((item) => {
  nodePool[item.type] = {
    free: [],
    allocated: [],
    size: item.size || DEFAULT_POOL_SIZE
  }
});

function request(options = {}, childOptions = {}) {

  const pool = nodePool[options.className];

  if (!pool) {
    console.warn('WTF no nodePool / className?', options);
    return;
  }

  // first, try to fetch.
  let item = pool.free.pop();

  if (item) {

    // hackish: only restore "original" className if needed, avoiding I/O.
    if (item.dom.o.className !== item.originalCSS) {
      item.dom.o.className = item.originalCSS;
    }

    // and restore "visibility"
    item.dom.o._style.setProperty('opacity', 1);

  }

  // create, as needed.
  if (!item) {

    item = {
      dom: {
        o: sprites.create(options)
      },
      release: (/* return for re-use */) => release(pool, item),
      steal: (/* remove from pool entirely */) => deallocate(pool, item)
    };

    item.originalCSS = item.dom.o.className.toString();

    if (childOptions.subSprite) {
      item.dom.oSubSprite = sprites.makeSubSprite();
      item.dom.o.appendChild(item.dom.oSubSprite);
    }
    if (childOptions.transformSprite) {
      item.dom.oTransformSprite = sprites.makeTransformSprite();
      item.dom.o.appendChild(item.dom.oTransformSprite);
    }

  }

  // whether fetched or created, move to the allocated pool.
  pool.allocated.push(item);

  return item;

}

function deallocate(pool, item) {

  if (!pool || !item) {
    console.warn('deallocate(): WTF, no pool or item?', pool, item);
    return;
  }

  // remove from allocated
  const offset = pool.allocated.indexOf(item);

  if (offset === -1) {
    console.warn('deallocate(): WTF, could not find item - no longer allocated?', item, pool.allocated);
    return;
  }

  return pool.allocated.splice(offset, 1);

}

function release(pool, item) {

  if (!pool || !item) {
    console.warn('release(): WTF, no pool or item?', pool, item);
    return;
  }

  // hackish: "hide" item
  item.dom.o._style.setProperty('opacity', 0);

  deallocate(pool, item);

  // add to free, up to limit
  if (pool.free.length < pool.size) {
    pool.free.push(item);
  } else {
    sprites.removeNodes(item.dom);
    item.release = null;
    item = null;
  }

}

// for some reason, this makes me think of Adam Sandler.
const poolBoy = {
  request
};

export { poolBoy }