import { Unit, Checkpoints, Direction, TimerValue } from '../types';
interface TimerOptions {
    initialTime: number;
    direction: "forward" | "backward";
    timeToUpdate: number;
    startImmediately: boolean;
    lastUnit: Unit;
    checkpoints: Checkpoints;
    formatValue: (value: number) => string;
    onStart: () => void;
    onResume: () => void;
    onPause: () => void;
    onStop: () => void;
    onReset: () => void;
}
export declare function useTimer({ initialTime, direction, timeToUpdate, startImmediately, lastUnit, checkpoints, onStart, onResume, onPause, onStop, onReset, }?: Partial<TimerOptions>): {
    controls: {
        start: () => void;
        stop: () => void;
        pause: () => void;
        reset: () => void;
        resume: () => void;
        setTime: (time: number) => void;
        getTime: () => number;
        getTimerState: () => import("../types").TimerStateValues;
        setDirection: (direction: Direction) => void;
        setLastUnit: (lastUnit: Unit) => void;
        setTimeToUpdate: (interval: number) => void;
        setCheckpoints: (checkpoints: import("../types").Checkpoint[]) => void;
    };
    value: TimerValue;
};
export {};
