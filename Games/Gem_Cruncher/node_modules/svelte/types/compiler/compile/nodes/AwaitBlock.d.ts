import Node from './shared/Node';
import PendingBlock from './PendingBlock';
import ThenBlock from './ThenBlock';
import CatchBlock from './CatchBlock';
import Expression from './shared/Expression';
import { Pattern } from 'estree';
import Component from '../Component';
import TemplateScope from './shared/TemplateScope';
import { TemplateNode } from '../../interfaces';
export default class AwaitBlock extends Node {
    type: 'AwaitBlock';
    expression: Expression;
    value: DestructurePattern;
    error: DestructurePattern;
    pending: PendingBlock;
    then: ThenBlock;
    catch: CatchBlock;
    constructor(component: Component, parent: any, scope: TemplateScope, info: TemplateNode);
}
export declare class DestructurePattern {
    pattern: Pattern;
    expressions: string[];
    identifier_name: string | undefined;
    constructor(pattern: Pattern);
}
