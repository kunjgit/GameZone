export type GlobalStateSlot = 'active' | 'checked' | 'completed' | 'disabled' | 'readOnly' | 'error' | 'expanded' | 'focused' | 'focusVisible' | 'required' | 'selected';
export default function generateUtilityClass(componentName: string, slot: string, globalStatePrefix?: string): string;
