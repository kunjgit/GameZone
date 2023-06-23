import { Buttons } from './buttons.js';
import { Device } from './device.js';
import { Mouse } from './mouse.js';
import { Pointer } from './pointer.js';

var _registry, _k;
class PointerHost {
    isKeyPressed(keyDef) {
        return this.devices.get(keyDef.pointerType).isPressed(keyDef);
    }
    async press(instance, keyDef, position) {
        const pointerName = this.getPointerName(keyDef);
        const pointer = keyDef.pointerType === 'touch' ? this.pointers.new(pointerName, keyDef).init(instance, position) : this.pointers.get(pointerName);
        // TODO: deprecate the following implicit setting of position
        pointer.position = position;
        if (pointer.pointerType !== 'touch') {
            this.mouse.position = position;
        }
        this.devices.get(keyDef.pointerType).addPressed(keyDef);
        this.buttons.down(keyDef);
        pointer.down(instance, keyDef);
        if (pointer.pointerType !== 'touch' && !pointer.isPrevented) {
            this.mouse.down(instance, keyDef, pointer);
        }
    }
    async move(instance, pointerName, position) {
        const pointer = this.pointers.get(pointerName);
        // In (some?) browsers this order of events can be observed.
        // This interweaving of events is probably unnecessary.
        // While the order of mouse (or pointer) events is defined per spec,
        // the order in which they interweave/follow on a user interaction depends on the implementation.
        const pointermove = pointer.move(instance, position);
        const mousemove = pointer.pointerType === 'touch' || pointer.isPrevented && pointer.isDown ? undefined : this.mouse.move(instance, position);
        pointermove === null || pointermove === void 0 ? void 0 : pointermove.leave();
        mousemove === null || mousemove === void 0 ? void 0 : mousemove.leave();
        pointermove === null || pointermove === void 0 ? void 0 : pointermove.enter();
        mousemove === null || mousemove === void 0 ? void 0 : mousemove.enter();
        pointermove === null || pointermove === void 0 ? void 0 : pointermove.move();
        mousemove === null || mousemove === void 0 ? void 0 : mousemove.move();
    }
    async release(instance, keyDef, position) {
        const device = this.devices.get(keyDef.pointerType);
        device.removePressed(keyDef);
        this.buttons.up(keyDef);
        const pointer = this.pointers.get(this.getPointerName(keyDef));
        // TODO: deprecate the following implicit setting of position
        pointer.position = position;
        if (pointer.pointerType !== 'touch') {
            this.mouse.position = position;
        }
        if (device.countPressed === 0) {
            pointer.up(instance, keyDef);
        }
        if (pointer.pointerType === 'touch') {
            pointer.release(instance);
        }
        if (!pointer.isPrevented) {
            if (pointer.pointerType === 'touch' && !pointer.isMultitouch) {
                const mousemove = this.mouse.move(instance, pointer.position);
                mousemove === null || mousemove === void 0 ? void 0 : mousemove.leave();
                mousemove === null || mousemove === void 0 ? void 0 : mousemove.enter();
                mousemove === null || mousemove === void 0 ? void 0 : mousemove.move();
                this.mouse.down(instance, keyDef, pointer);
            }
            if (!pointer.isMultitouch) {
                const mousemove1 = this.mouse.move(instance, pointer.position);
                mousemove1 === null || mousemove1 === void 0 ? void 0 : mousemove1.leave();
                mousemove1 === null || mousemove1 === void 0 ? void 0 : mousemove1.enter();
                mousemove1 === null || mousemove1 === void 0 ? void 0 : mousemove1.move();
                this.mouse.up(instance, keyDef, pointer);
            }
        }
    }
    getPointerName(keyDef) {
        return keyDef.pointerType === 'touch' ? keyDef.name : keyDef.pointerType;
    }
    getPreviousPosition(pointerName) {
        return this.pointers.has(pointerName) ? this.pointers.get(pointerName).position : undefined;
    }
    resetClickCount() {
        this.mouse.resetClickCount();
    }
    getMouseTarget(instance) {
        var _target;
        return (_target = this.mouse.position.target) !== null && _target !== void 0 ? _target : instance.config.document.body;
    }
    setMousePosition(position) {
        this.mouse.position = position;
        this.pointers.get('mouse').position = position;
    }
    constructor(system){
        this.devices = new class {
            get(k) {
                var ref;
                (ref = (_registry = this.registry)[_k = k]) !== null && ref !== void 0 ? ref : _registry[_k] = new Device();
                return this.registry[k];
            }
            constructor(){
                this.registry = {};
            }
        }();
        this.pointers = new class {
            new(pointerName, keyDef) {
                const isPrimary = keyDef.pointerType !== 'touch' || !Object.values(this.registry).some((p)=>p.pointerType === 'touch' && !p.isCancelled);
                if (!isPrimary) {
                    Object.values(this.registry).forEach((p)=>{
                        if (p.pointerType === keyDef.pointerType && !p.isCancelled) {
                            p.isMultitouch = true;
                        }
                    });
                }
                this.registry[pointerName] = new Pointer({
                    pointerId: this.nextId++,
                    pointerType: keyDef.pointerType,
                    isPrimary
                });
                return this.registry[pointerName];
            }
            get(pointerName) {
                if (!this.has(pointerName)) {
                    throw new Error(`Trying to access pointer "${pointerName}" which does not exist.`);
                }
                return this.registry[pointerName];
            }
            has(pointerName) {
                return pointerName in this.registry;
            }
            constructor(){
                this.registry = {
                    mouse: new Pointer({
                        pointerId: 1,
                        pointerType: 'mouse',
                        isPrimary: true
                    })
                };
                this.nextId = 2;
            }
        }();
        this.system = system;
        this.buttons = new Buttons();
        this.mouse = new Mouse();
    }
}

export { PointerHost };
