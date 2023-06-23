/// <reference types="react" />
import { BaseProps } from '../type';
interface CommentProps extends BaseProps {
    backgroundColor?: string;
}
export default function Comment({ visible, width, height, backgroundColor, color, wrapperClass, wrapperStyle, ariaLabel, }: CommentProps): JSX.Element | null;
export {};
