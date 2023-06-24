import { FPS, debug } from '../core/global.js';

const Queue = () => {

  let data, exports;

  data = {
    frameCount: 0,
    processInterval: FPS * 3,
    queue: [],
    nextFrameQueue: [],
    queueMax: 128
  };

  function process() {

    if (debug) {
      console.log(`processing queue of ${data.queue.length} items at frameCount = ${data.frameCount}`);
    }

    // process all items in queue
    let i, j;

    for (i = 0, j = data.queue.length; i < j; i++) {
      data.queue[i]();
    }

    // reset the queue + counter
    data.queue = [];
    data.frameCount = 0;

  }

  function processNextFrame() {

    // process all items in queue
    let i, queueLength;
    
    queueLength = data.nextFrameQueue.length;

    if (!queueLength) return;

    for (i = 0; i < queueLength; i++) {
      data.nextFrameQueue[i]();
    }

    data.nextFrameQueue = [];

  }

  function add(callback) {

    // reset frameCount on add?
    data.frameCount = 0;
    data.queue.push(callback);

    if (data.queue.length >= data.queueMax) {
      // flush the queue
      process();
    }

  }

  function addNextFrame(callback) {

    data.nextFrameQueue.push(callback);

  }

  function animate() {

    data.frameCount++;

    processNextFrame();

    if (data.frameCount % data.processInterval === 0) {
      process();
    }

  }

  exports = {
    add,
    addNextFrame,
    animate,
    process
  };

  return exports;

};

export { Queue };