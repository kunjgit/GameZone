import Wrapper from './shared/Wrapper';
import Renderer from '../Renderer';
import Block from '../Block';
import AwaitBlock from '../../nodes/AwaitBlock';
import FragmentWrapper from './Fragment';
import PendingBlock from '../../nodes/PendingBlock';
import ThenBlock from '../../nodes/ThenBlock';
import CatchBlock from '../../nodes/CatchBlock';
import { Identifier } from 'estree';
declare class AwaitBlockBranch extends Wrapper {
    node: PendingBlock | ThenBlock | CatchBlock;
    block: Block;
    fragment: FragmentWrapper;
    is_dynamic: boolean;
    var: any;
    constructor(status: string, renderer: Renderer, block: Block, parent: Wrapper, node: AwaitBlock, strip_whitespace: boolean, next_sibling: Wrapper);
    render(block: Block, parent_node: Identifier, parent_nodes: Identifier): void;
    render_destructure(block: Block, value: any, node: any, index: any): void;
}
export default class AwaitBlockWrapper extends Wrapper {
    node: AwaitBlock;
    pending: AwaitBlockBranch;
    then: AwaitBlockBranch;
    catch: AwaitBlockBranch;
    value: string;
    error: string;
    var: Identifier;
    constructor(renderer: Renderer, block: Block, parent: Wrapper, node: AwaitBlock, strip_whitespace: boolean, next_sibling: Wrapper);
    render(block: Block, parent_node: Identifier, parent_nodes: Identifier): void;
}
export {};
