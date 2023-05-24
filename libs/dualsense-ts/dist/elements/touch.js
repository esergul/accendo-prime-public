"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Touch = void 0;
const analog_1 = require("./analog");
const increment_1 = require("./increment");
/**
 * Represents a touchpad touch, treated like an analog joystick input
 * with [0,0] representing the center of the touchpad.
 */
class Touch extends analog_1.Analog {
    constructor() {
        super(...arguments);
        this.state = this;
        this.contact = this.button;
        this.tracker = new increment_1.Increment();
        this.deadzone = 0;
    }
    get active() {
        return this.contact.active;
    }
}
exports.Touch = Touch;
//# sourceMappingURL=touch.js.map