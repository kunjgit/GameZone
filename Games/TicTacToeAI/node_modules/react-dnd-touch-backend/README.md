<img src="https://avatars2.githubusercontent.com/u/6412038?v=3&s=200" alt="react logo" title="react" align="right" width="64" height="64" />

# react-dnd-touch-backend

[![npm version](https://badge.fury.io/js/react-dnd-touch-backend.svg)](http://badge.fury.io/js/react-dnd-touch-backend)
[![Dependency Status](https://david-dm.org/yahoo/react-dnd-touch-backend.svg)](https://david-dm.org/yahoo/react-dnd-touch-backend)
[![devDependency Status](https://david-dm.org/yahoo/react-dnd-touch-backend/dev-status.svg)](https://david-dm.org/yahoo/react-dnd-touch-backend#info=devDependencies)
![gzip size](http://img.badgesize.io/https://npmcdn.com/react-dnd-touch-backend?compression=gzip)

Touch Backend for [react-dnd](https://github.com/gaearon/react-dnd)

## Usage
Follow [react-dnd docs](http://gaearon.github.io/react-dnd/) to setup your app. Then swap out `HTML5Backend` for `TouchBackend` as such:

```js
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';

var YourApp = React.createClass(
  /* ... */

);

module.exports = DragDropContext(TouchBackend)(YourApp);
```

### Options

You have the following options available to you, which you can pass in like so:

```js
DragDropContext(TouchBackend(options))
```

Options include:

- enableTouchEvents
- enableMouseEvents
- enableKeyboardEvents
- delayTouchStart
- delayMouseStart

## Tips
### Drag Preview
Since native Drag-n-Drop is not currently supported in touch devices. A custom [DragPreview](https://gaearon.github.io/react-dnd/docs-drag-layer.html) is required. Check out the [example](https://github.com/yahoo/react-dnd-touch-backend/blob/master/examples/js/ItemPreview.jsx) for a sample implementation.

We might try to build it directly in the Backend itself in the future to compensate for this limitation.

### Mouse events support*
You can enable capturing mouse events by configuring your TouchBackend as follows:
```js
DragDropContext(TouchBackend({ enableMouseEvents: true }));
```
**NOTE*: This is buggy due to the difference in `touchstart/touchend` event propagation compared to `mousedown/mouseup/click`. I highly recommend that you use [react-dnd-html5-backend](https://github.com/gaearon/react-dnd-html5-backend) instead for a more performant native HTML5 drag capability.**

## Examples
The `examples` folder has a sample integration. In order to build it, run:
```bash
npm i && npm run dev
```
Then navigate to `localhost:7789` or `(IP Address):7789` in your mobile browser to access the example.
Code licensed under the MIT license. See LICENSE file for terms.
