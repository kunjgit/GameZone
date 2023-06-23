import type { FloatingElement, ReferenceElement } from './types';
export type Options = Partial<{
    /**
     * Whether to update the position when an overflow ancestor is scrolled.
     * @default true
     */
    ancestorScroll: boolean;
    /**
     * Whether to update the position when an overflow ancestor is resized. This
     * uses the native `resize` event.
     * @default true
     */
    ancestorResize: boolean;
    /**
     * Whether to update the position when either the reference or floating
     * elements resized. This uses a `ResizeObserver`.
     * @default true
     */
    elementResize: boolean;
    /**
     * Whether to update on every animation frame if necessary. Optimized for
     * performance so updates are only called when necessary, but use sparingly.
     * @default false
     */
    animationFrame: boolean;
}>;
/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
export declare function autoUpdate(reference: ReferenceElement, floating: FloatingElement, update: () => void, options?: Options): () => void;
