import { TimeParts, Checkpoint, Direction, TimerValue, Unit } from '../../types';
export declare class TimerModel {
    private initialTime;
    private internalTime;
    private time;
    private direction;
    private timeToUpdate;
    private lastUnit;
    private checkpoints;
    private innerState;
    private onChange;
    private timerId;
    constructor({ initialTime, direction, timeToUpdate, lastUnit, checkpoints, onChange, }: {
        initialTime: number;
        direction: Direction;
        timeToUpdate: number;
        lastUnit: Unit;
        checkpoints: Checkpoint[];
        onChange: (timerValue?: TimerValue) => void;
    });
    readonly state: import("../../types").TimerStateValues;
    readonly timeParts: TimeParts;
    getTimeParts(time: any): TimeParts;
    setTime(time: number): void;
    getTime(): number;
    setLastUnit(lastUnit: Unit): void;
    setTimeToUpdate(interval: number): void;
    setDirection(direction: any): void;
    setCheckpoints(checkpoints: any): void;
    start(): void;
    resume(callImmediately?: boolean): void;
    pause(): void;
    stop(): void;
    reset(): void;
    private setTimerInterval;
    private computeTime;
}
