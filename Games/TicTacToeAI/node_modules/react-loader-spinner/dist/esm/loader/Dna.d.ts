/// <reference types="react" />
import { BaseProps } from '../type';
interface DNAProps extends Omit<BaseProps, 'color'> {
}
export default function DNA({ visible, width, height, wrapperClass, wrapperStyle, ariaLabel, }: DNAProps): JSX.Element | null;
export {};
