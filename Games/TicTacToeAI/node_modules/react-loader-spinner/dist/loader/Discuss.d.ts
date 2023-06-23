/// <reference types="react" />
import { BaseProps } from '../type';
interface DiscussProps extends Omit<BaseProps, 'color'> {
    colors?: [string, string];
}
export default function Discuss({ visible, width, height, wrapperClass, wrapperStyle, ariaLabel, colors }: DiscussProps): JSX.Element | null;
export {};
