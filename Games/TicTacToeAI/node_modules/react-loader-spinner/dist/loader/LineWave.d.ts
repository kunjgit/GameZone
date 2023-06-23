import React from 'react';
import { Style } from '../type';
declare type Props = {
    wrapperStyle?: Style;
    visible?: boolean;
    wrapperClass?: string;
    height?: string | number;
    width?: string | number;
    color?: string;
    firstLineColor?: string;
    middleLineColor?: string;
    lastLineColor?: string;
    ariaLabel?: string;
};
declare const LineWave: React.FunctionComponent<Props>;
export default LineWave;
