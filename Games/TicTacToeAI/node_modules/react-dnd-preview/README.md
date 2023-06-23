# React DnD Preview [![NPM Version][npm-image]][npm-url] [![dependencies Status][deps-image]][deps-url] [![devDependencies Status][deps-dev-image]][deps-dev-url]

[Try it here!](https://louisbrunner.github.io/dnd-multi-backend/examples/react-dnd-preview.html)

This project is a React component compatible with [React DnD](https://github.com/gaearon/react-dnd) that can be used to emulate a Drag'n'Drop "ghost" when a Backend system doesn't have one (e.g. `react-dnd-touch-backend`).

## Installation

```sh
npm install react-dnd-preview
```

## Usage & Example

Just include the `Preview` component close to the top component of your application (it places itself absolutely) and provide a function as the `generator` prop.

This function will take 3 arguments: `itemType`, `item` (both defined by the `DragSource`) and `style` which will be used to position the preview element. The function needs to return something that React can render (React component, `null`, etc).

See also the [examples](examples/) for more information.

```js
  import Preview from 'react-dnd-preview';
  ...

  class App extends React.Component {
    ...

    previewGenerator(itemType, item, style) {
      return <div class="item-list__item" style={style}>{itemType}</div>;
    }

    ...

    render() {
      return (
        <div>
          <ItemList />
          <Preview generator={this.previewGenerator} />
        </div>
      );
    }
  }
```

## License

MIT, Copyright (c) 2016-2018 Louis Brunner



[npm-image]: https://img.shields.io/npm/v/react-dnd-preview.svg
[npm-url]: https://npmjs.org/package/react-dnd-preview
[deps-image]: https://david-dm.org/louisbrunner/react-dnd-preview/status.svg
[deps-url]: https://david-dm.org/louisbrunner/react-dnd-preview
[deps-dev-image]: https://david-dm.org/louisbrunner/react-dnd-preview/dev-status.svg
[deps-dev-url]: https://david-dm.org/louisbrunner/react-dnd-preview?type=dev
