import { TimeParts, Unit } from '../../types';

import getTimeParts from './getTimeParts';

describe('#getTimeParts', () => {
  [
    [0, 'h', { h: 0, m: 0, s: 0, ms: 0 }],
    [30, 'ms', { ms: 30 }],
    [1030, 'ms', { ms: 1030 }],
    [1030, 's', { s: 1, ms: 30 }],
    [61030, 's', { s: 61, ms: 30 }],
    [61030, 'm', { m: 1, s: 1, ms: 30 }],
    [3601030, 'm', { m: 60, s: 1, ms: 30 }],
    [3661030, 'h', { h: 1, m: 1, s: 1, ms: 30 }],
    [86461030, 'h', { h: 24, m: 1, s: 1, ms: 30 }],
    [90061030, 'd', { d: 1, h: 1, m: 1, s: 1, ms: 30 }],
  ].forEach(([time, lastUnit, result]) => {
    it(`should return right result for time = ${time} and lastUnit = ${lastUnit}`, () => {
      expect(getTimeParts(time as number, lastUnit as Unit)).toStrictEqual({
        ms: 0,
        s: 0,
        m: 0,
        h: 0,
        d: 0,
        ...(result as TimeParts),
      });
    });
  });
});
