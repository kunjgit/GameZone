# DnD Multi Backend [![NPM Version][npm-image]][npm-url] [![dependencies Status][deps-image]][deps-url] [![devDependencies Status][deps-dev-image]][deps-dev-url]

[Try it here!](https://louisbrunner.github.io/dnd-multi-backend/examples/dnd-multi-backend.html)

This project is a Drag'n'Drop backend compatible with [DnD Core](https://github.com/react-dnd/react-dnd/tree/master/packages/dnd-core).
It enables your application to use different DnD backends depending on the situation. This package is completely frontend-agnostic, you can refer to [this page](https://github.com/LouisBrunner/dnd-multi-backend) for frontend-specific packages. This means if your front-end is not yet supported, you'll have to roll out your own.

## Installation

```sh
npm install dnd-multi-backend
```

## Usage & Example

You should only use this package if your framework is not in the supported list:
 - [React](../react-dnd-multi-backend)
 - [Angular](https://github.com/cormacrelf/angular-skyhook)

In this case, you will need to write a [custom pipeline](../react-dnd-multi-backend#create-a-custom-pipeline) including as many `dnd-core` backends as you wish. See also the [examples](examples/) for more information.

```js
import { DragDropManager, DragSource, DropTarget } from 'dnd-core';
import MultiBackend from 'dnd-multi-backend';

// Define the backend and pipeline
class HTML5Backend {
  constructor(manager) {
    this.manager = manager;
  }

  setup() {}
  teardown() {}

  connectDragSource(sourceId, node, options) {
    ...

    return () => {};
  }

  connectDragPreview(previewId, node, options) {
    ...

    return () => {};
  }

  connectDropTarget(targetId, node, options) {
    ...

    return () => {};
  }
}

...

const pipeline = {
  backends: [
    {
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      backend: TouchBackend,
      preview: true,
      transition: TouchTransition,
    },
  ],
};

// Setup the manager
const manager = new DragDropManager(MultiBackend(pipeline));
const registry = manager.getRegistry();

// Setup your DnD logic
class Source {
  ...

  canDrag() {}
  beginDrag() {}
  isDragging() {}
  endDrag() {}
}

class Target {
  ...

  canDrop() {}
  hover() {}
  drop() {}
}

// Define the DnD logic on the manager
const Item = 'item';
const src = new Source();
const dst = new Target();

const srcId = registry.addSource(Item, src);
const dstId = registry.addTarget(Item, dst);

// Link the DOM with the logic
const srcP = document.createElement('p');
const srcTxt = document.createTextNode('Source');
srcP.appendChild(srcTxt);
document.body.appendChild(srcP);
manager.getBackend().connectDragSource(srcId, srcP);

const dstP = document.createElement('p');
const dstTxt = document.createTextNode('Target');
dstP.appendChild(dstTxt);
document.body.appendChild(dstP);
manager.getBackend().connectDropTarget(dstId, dstP);
```

## License

MIT, Copyright (c) 2016-2018 Louis Brunner



[npm-image]: https://img.shields.io/npm/v/dnd-multi-backend.svg
[npm-url]: https://npmjs.org/package/dnd-multi-backend
[deps-image]: https://david-dm.org/louisbrunner/dnd-multi-backend/status.svg
[deps-url]: https://david-dm.org/louisbrunner/dnd-multi-backend
[deps-dev-image]: https://david-dm.org/louisbrunner/dnd-multi-backend/dev-status.svg
[deps-dev-url]: https://david-dm.org/louisbrunner/dnd-multi-backend?type=dev
