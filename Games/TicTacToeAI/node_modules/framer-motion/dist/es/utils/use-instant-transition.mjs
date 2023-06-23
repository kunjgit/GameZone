import { frame } from '../frameloop/index.mjs';
import { useEffect } from 'react';
import { useInstantLayoutTransition } from '../projection/use-instant-layout-transition.mjs';
import { useForceUpdate } from './use-force-update.mjs';
import { instantAnimationState } from './use-instant-transition-state.mjs';

function useInstantTransition() {
    const [forceUpdate, forcedRenderCount] = useForceUpdate();
    const startInstantLayoutTransition = useInstantLayoutTransition();
    useEffect(() => {
        /**
         * Unblock after two animation frames, otherwise this will unblock too soon.
         */
        frame.postRender(() => frame.postRender(() => (instantAnimationState.current = false)));
    }, [forcedRenderCount]);
    return (callback) => {
        startInstantLayoutTransition(() => {
            instantAnimationState.current = true;
            forceUpdate();
            callback();
        });
    };
}

export { useInstantTransition };
