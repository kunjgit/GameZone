/// <reference types="react" />
import { BaseProps } from '../type';
interface ProgressBarProps extends Omit<BaseProps, 'color'> {
    borderColor?: string;
    barColor?: string;
}
export default function ProgressBar({ visible, height, width, wrapperClass, wrapperStyle, ariaLabel, borderColor, barColor, }: ProgressBarProps): JSX.Element | null;
export {};
