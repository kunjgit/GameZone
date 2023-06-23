import { FunctionComponent } from 'react';
import { BaseProps } from '../type';
interface RevolvingDotProps extends BaseProps {
    radius?: number;
    secondaryColor?: string;
    strokeWidth?: number;
}
declare const RevolvingDot: FunctionComponent<RevolvingDotProps>;
export default RevolvingDot;
