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
import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

import {
  VerlyStage,
  Rect,
  VerlyEntity,
  Stick,
  Point,
  Rope,
  Cloth,
  Hexagon,
  Ragdoll
} from './VerlyComponent';

const MyCustomEntity = ({ verly }) => {
  return (
    <VerlyEntity verly={verly}>
      <Point x={100} y={150} />
      <Point x={200} y={100} />
      <Point x={200} y={220} />
      <Point x={100} y={200} />
      <Stick indices={[0, 1]} />
      <Stick indices={[1, 2]} />
      <Stick indices={[2, 3]} />
      <Stick indices={[3, 0]} />
      <Stick indices={[3, 1]} />
      <Stick indices={[2, 0]} />
    </VerlyEntity>
  );
};

function App() {
  return (
    <div>
      <VerlyStage width={500} height={500} iterations={20}>
        <Rect x={30} y={100} width={100} height={100} />
        <Rope x={30} y={100} segs={10} gap={10} pin={0} />
        <Cloth x={200} y={100} width={200} height={200} segs={15} pin={2} />
        <Hexagon
          x={300}
          y={100}
          segs={12}
          stride1={5}
          stride2={8}
          radius={50}
        />
        <Ragdoll x={300} y={100} />
        <MyCustomEntity />
      </VerlyStage>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
