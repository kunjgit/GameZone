import { FunctionComponent } from 'react';
import { BaseProps } from '../type';
interface MutatingDotsProps extends BaseProps {
    radius?: string | number;
    secondaryColor?: string;
}
declare const MutatingDots: FunctionComponent<MutatingDotsProps>;
export default MutatingDots;
