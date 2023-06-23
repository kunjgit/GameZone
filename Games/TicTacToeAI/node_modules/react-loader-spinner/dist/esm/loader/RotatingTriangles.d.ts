/// <reference types="react" />
import { BaseProps } from '../type';
interface RotatingTrianglesProps extends Omit<BaseProps, 'color'> {
    colors?: [string, string, string];
}
export default function RotatingTriangles({ visible, height, width, wrapperClass, wrapperStyle, ariaLabel, colors, }: RotatingTrianglesProps): JSX.Element | null;
export {};
