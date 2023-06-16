class Cooldown{
    constructor(cooldown,notImmediately=false) {
        this.cooldown = notImmediately ? this.getCooldown(cooldown) : 0;
        this.initCooldown = cooldown;
    }

    getCooldown(cooldown) {
        if (isArray(this.initCooldown)) {
            return random.apply(null, this.initCooldown);
        }
        return cooldown;
    }

    update() {
        this.cooldown--;
        return this;
    }
    
    active(callback) {
        if (this.cooldown <= 0) {
            this.reset();
            callback();
        }
    }

    reset() {
        this.cooldown = this.getCooldown(this.initCooldown);
    }
}