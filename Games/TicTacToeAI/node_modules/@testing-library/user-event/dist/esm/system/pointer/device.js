class Device {
    get countPressed() {
        return this.pressedKeys.size;
    }
    isPressed(keyDef) {
        return this.pressedKeys.has(keyDef.name);
    }
    addPressed(keyDef) {
        return this.pressedKeys.add(keyDef.name);
    }
    removePressed(keyDef) {
        return this.pressedKeys.delete(keyDef.name);
    }
    constructor(){
        this.pressedKeys = new Set();
    }
}

export { Device };
