/// <reference types="react" />
import { BaseProps } from '../type';
interface FidgetSpinnerProps extends Omit<BaseProps, 'color'> {
    backgroundColor?: string;
    ballColors?: [string, string, string];
}
export default function FidgetSpinner({ width, height, backgroundColor, ballColors, wrapperClass, wrapperStyle, ariaLabel, visible, }: FidgetSpinnerProps): JSX.Element | null;
export {};
