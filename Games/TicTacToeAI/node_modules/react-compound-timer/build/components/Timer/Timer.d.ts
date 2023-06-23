import React from 'react';
import { TimerStateValues, TimeParts } from '../../types';
declare type FormatValueType = (value: number) => string;
declare type TimerContextType = TimeParts & {
    formatValue: FormatValueType;
};
interface TimerValueItemProps {
    formatValue?: FormatValueType;
}
interface TimerProps {
    /** Timer count direction */
    direction?: 'forward' | 'backward';
    /** Inittial time on timer */
    initialTime?: number;
    /** Time to rerender */
    timeToUpdate?: number;
    /** Start timer immediately after render */
    startImmediately?: boolean;
    /** Function to format all values */
    formatValue?: (value: number) => string;
    /** Function that will be called on timer start */
    onStart?: () => any;
    /** Function that will be called on timer resume */
    onResume?: () => any;
    /** Function that will be called on timer pause */
    onPause?: () => any;
    /** Function that will be called on timer stop */
    onStop?: () => any;
    /** Function that will be called on timer reset */
    onReset?: () => any;
    /** Last unit will accumulate time, for example, 26 hours or 90 seconds */
    lastUnit?: 'ms' | 's' | 'm' | 'h' | 'd';
    /** Time checkpoints with callback functions */
    checkpoints?: Array<{
        time: number;
        callback: () => any;
    }>;
}
interface TimerState extends TimeParts {
    timerState: TimerStateValues;
}
declare class Timer extends React.PureComponent<TimerProps, TimerState> {
    static Consumer: React.ExoticComponent<React.ConsumerProps<TimerContextType>>;
    static Milliseconds: React.FunctionComponent<TimerValueItemProps>;
    static Seconds: React.FunctionComponent<TimerValueItemProps>;
    static Minutes: React.FunctionComponent<TimerValueItemProps>;
    static Hours: React.FunctionComponent<TimerValueItemProps>;
    static Days: React.FunctionComponent<TimerValueItemProps>;
    static defaultProps: {
        timeToUpdate: number;
        direction: string;
        initialTime: number;
        startImmediately: boolean;
        lastUnit: string;
        checkpoints: any[];
        children: any;
        formatValue: (value: any) => string;
        onStart: () => void;
        onResume: () => void;
        onPause: () => void;
        onStop: () => void;
        onReset: () => void;
    };
    static getUI(children: any, renderProps: any): any;
    private timer;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private setTime;
    private getTime;
    private getTimerState;
    private setDirection;
    private setCheckpoints;
    private start;
    private stop;
    private pause;
    private reset;
    private resume;
}
export default Timer;
