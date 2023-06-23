import { FunctionComponent } from 'react';
import { BaseProps } from '../type';
interface OvalProps extends BaseProps {
    strokeWidth?: string | number;
    strokeWidthSecondary?: string | number;
    secondaryColor?: string;
}
declare const Oval: FunctionComponent<OvalProps>;
export default Oval;
