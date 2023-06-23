import React from 'react';
import { Style } from '../type';
declare type RotatingSquareProps = {
    wrapperClass?: string;
    color?: string;
    strokeWidth?: string | number;
    height?: string | number;
    width?: string | number;
    ariaLabel?: string;
    wrapperStyle?: Style;
    visible?: boolean;
};
declare const RotatingSquare: React.FunctionComponent<RotatingSquareProps>;
export default RotatingSquare;
