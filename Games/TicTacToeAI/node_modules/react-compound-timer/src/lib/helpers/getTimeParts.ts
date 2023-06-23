import { Unit, TimeParts } from '../../types';

export default function getTimeParts(time: number, lastUnit: Unit): TimeParts {
  const units: Unit[] = ['ms', 's', 'm', 'h', 'd'];
  const lastUnitIndex = units.findIndex(unit => unit === lastUnit);

  const dividers = [1000, 60, 60, 24, 1];
  const dividersAcc = [1, 1000, 60000, 3600000, 86400000];

  const startValue = {
    ms: 0,
    s: 0,
    m: 0,
    h: 0,
    d: 0,
  };

  const output = units.reduce(
    (obj, unit, index) => {
      if (index > lastUnitIndex) {
        obj[unit] = 0;
      } else if (index === lastUnitIndex) {
        obj[unit] = Math.floor(time / dividersAcc[index]);
      } else {
        obj[unit] = Math.floor(time / dividersAcc[index]) % dividers[index];
      }

      return obj;
    },
    startValue,
  );

  return output;
}
