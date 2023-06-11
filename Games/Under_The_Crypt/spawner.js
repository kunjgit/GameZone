'use strict';

/**
 * Creates a Spawner that issues 8 spirits before turning itself off.
 *
 * @constructor
 */
function Spawner(pos, wave) {
    /** @type {{x: number, y: number}} */
    this.pos = pos;
    /** @type {number} */
    this.wave = wave;
}
Spawner.prototype = {
    /**
     * Number of spirits spawned.
     * @type {number}
     */
    count: 0,
    /**
     * Time until spawning the next spirit in cycles.
     * @type number
     */
    timer: 120,
    /**
     * Returns whether the spawner is still active
     * @return {boolean} True if active
     */
    active: function () {
        return this.timer !== 0;
    },
    /**
     * Main spawner logic.
     * @return {boolean} False if spawner can be removed.
     */
    update: function () {
        // keep spawner if not yet activated
        if (!this.timer) {
            return true;
        }
        this.timer -= 1;
        if (this.timer === 0) {
            g.spawnSpirit(this.pos.x, this.pos.y, this.wave);
            this.count += 1;
            // remove spawner if it spawned 8 spirits
            if (this.count === 8) {
                return false;
            }
            this.timer = 50;
        }
        return true;
    }
};
