import React from 'react';
import { Style } from '../type';
declare type Props = {
    wrapperStyle?: Style;
    visible?: boolean;
    wrapperClass?: string;
    height?: string | number;
    width?: string | number;
    color?: string;
    outerCircleColor?: string;
    innerCircleColor?: string;
    barColor?: string;
    ariaLabel?: string;
};
declare const CirclesWithBar: React.FunctionComponent<Props>;
export default CirclesWithBar;
