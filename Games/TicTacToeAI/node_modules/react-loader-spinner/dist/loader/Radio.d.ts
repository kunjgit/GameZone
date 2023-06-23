/// <reference types="react" />
import { BaseProps } from '../type';
interface RadioProps extends Omit<BaseProps, 'color'> {
    colors?: [string, string, string];
}
export default function Radio({ visible, height, width, wrapperClass, wrapperStyle, ariaLabel, colors, }: RadioProps): JSX.Element | null;
export {};
