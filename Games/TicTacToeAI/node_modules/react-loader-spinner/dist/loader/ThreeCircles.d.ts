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
    middleCircleColor?: string;
    ariaLabel?: string;
};
declare const ThreeCircles: React.FunctionComponent<Props>;
export default ThreeCircles;
