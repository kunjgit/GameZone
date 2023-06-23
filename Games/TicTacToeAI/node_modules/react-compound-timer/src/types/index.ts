export type Unit = 'ms' | 's' | 'm' | 'h' | 'd';

export interface Checkpoint {
  time: number;
  callback: () => any;
}

export type Checkpoints = Checkpoint[];

export interface TimeParts {
  ms: number;
  s: number;
  m: number;
  h: number;
  d: number;
}

export type TimerStateValues = 'INITED' | 'PLAYING' | 'PAUSED' | 'STOPPED';

export type Direction = 'forward' | 'backward';

export type TimerValue = TimeParts & { state: TimerStateValues };

export interface TimerControls {
  start: () => void;
  stop: () => void;
  pause: () => void;
  reset: () => void;
  resume: () => void;
  setTime: (time: number) => void;
  getTime: () => number;
  getTimerState: () => TimerStateValues;
  setDirection: (direction: Direction) => void;
  setLastUnit: (lastUnit: Unit) => void;
  setTimeToUpdate: (interval: number) => void;
  setCheckpoints: (checkpoints: Checkpoint[]) => void;
}
