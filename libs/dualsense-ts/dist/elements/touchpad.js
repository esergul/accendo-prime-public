"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Touchpad = void 0;
const momentary_1 = require("./momentary");
const touch_1 = require("./touch");
const input_1 = require("../input");
class Touchpad extends input_1.Input {
    get active() {
        return this.left.contact.active;
    }
    constructor(params) {
        super(params);
        this.state = this;
        this.button = new momentary_1.Momentary({ icon: "[__]" });
        this.left = new touch_1.Touch();
        this.right = new touch_1.Touch();
    }
}
exports.Touchpad = Touchpad;
//# sourceMappingURL=touchpad.js.map