
class Weapon {
    constructor(drawable, firerate, image) {
        this.drawable = drawable;
        this.firerate = firerate;
        this.image = image;
    }

    // A method used to draw the weapon.
    draw(ctx) {
        this.drawable.drawImage(ctx, this.image);        
    }

    // A method used to shoot the weapon.
    shoot() {
        // Don't allow to shoot if the weapon
        // is cooling down, or is reloading,
        // or it has no bullets.
        if (this.isCooldown)
            return false;
        
        this.startShootCooldown();

        // return true to tell the shooter
        // a shot was successfully fired.
        return true;
    }

    // A method used to start the weapon's shoot
    // cooldown to simulate firerate.
    startShootCooldown() {
        this.isCooldown = true;
        setTimeout(this.endShootCooldown.bind(this), this.firerate);
    }

    // A method used to end the weapon's shoot 
    // cooldown.
    endShootCooldown() {
        this.isCooldown = false;
    }

    // A method used to create an instance of a weapon
    // without passing an instance of a drawable and image.
    static create(x, y, w, h, firerate, imageSource) {
        const image = new Image();
        image.src = imageSource;
        const drawable = new Drawable(x, y, w, h);
        return new Weapon(drawable, firerate, image);
    }
}