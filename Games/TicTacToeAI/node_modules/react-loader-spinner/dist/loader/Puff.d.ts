import { FunctionComponent } from 'react';
import { BaseProps } from '../type';
interface PuffProps extends BaseProps {
    radius?: string | number;
    secondaryColor?: string;
}
export declare const Puff: FunctionComponent<PuffProps>;
export default Puff;
