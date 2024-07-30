import { Pattern, Identifier } from "estree";
import { Node } from "acorn";
export default function traverse_destructure_pattern(node: Pattern, callback: (node: Identifier, parent: Node, key: string | number) => void): void;
