/// <reference types="react" />
import { BaseProps } from '../type';
interface MagnifyingGlassProps extends BaseProps {
    glassColor?: string;
}
export default function MagnifyingGlass({ visible, height, width, wrapperClass, wrapperStyle, ariaLabel, glassColor, color, }: MagnifyingGlassProps): JSX.Element | null;
export {};
