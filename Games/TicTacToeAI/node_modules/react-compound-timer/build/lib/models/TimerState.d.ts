import { TimerStateValues } from '../../types';
export declare const INITED = "INITED";
export declare const PLAYING = "PLAYING";
export declare const PAUSED = "PAUSED";
export declare const STOPPED = "STOPPED";
export default class TimerState {
    private onChange;
    private state;
    constructor(onChangeStatus?: (obj: {
        state: TimerStateValues;
    }) => void);
    getState(): TimerStateValues;
    setInited(): boolean;
    isInited(): boolean;
    setPlaying(): boolean;
    isPlaying(): boolean;
    setPaused(): boolean;
    isPaused(): boolean;
    setStopped(): boolean;
    isStopped(): boolean;
}
