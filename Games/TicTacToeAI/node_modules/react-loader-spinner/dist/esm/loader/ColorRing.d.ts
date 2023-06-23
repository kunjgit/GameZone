/// <reference types="react" />
import { BaseProps } from '../type';
interface ColorRingProps extends Omit<BaseProps, 'color'> {
    colors?: [string, string, string, string, string];
}
export default function ColorRing({ visible, width, height, colors, wrapperClass, wrapperStyle, ariaLabel, }: ColorRingProps): JSX.Element | null;
export {};
