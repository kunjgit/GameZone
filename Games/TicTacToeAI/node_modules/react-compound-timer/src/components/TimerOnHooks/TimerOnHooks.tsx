import React, { useEffect } from 'react';
import { useTimer } from 'src/hook/useTimer';

export const TimerOnHooks: React.FC = () => {
  const { value, controls } = useTimer({ initialTime: 3000 });

  useEffect(
    () => {
      controls.setCheckpoints([
        {
          time: 0,
          callback: () => controls.setDirection('forward'),
        },
        {
          time: 5000,
          callback: () => console.log('5000 with React Hooks'),
        },
        {
          time: 10000,
          callback: () => controls.setDirection('backward'),
        },
      ]);
    },
    [],
  );

  if (!value) {
    return null;
  }

  return (
    <div>{value.s} s {value.ms}</div>
  );
};
