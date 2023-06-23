/// <reference types="react" />
import { BaseProps } from '../type';
interface VortexProps extends Omit<BaseProps, 'color'> {
    colors?: [string, string, string, string, string, string];
}
declare const Vortex: ({ visible, height, width, ariaLabel, wrapperStyle, wrapperClass, colors, }: VortexProps) => JSX.Element | null;
export default Vortex;
