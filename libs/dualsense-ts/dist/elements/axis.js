"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axis = void 0;
const input_1 = require("../input");
/**
 * Represents a simple ranged input. For example, one axis of an analog
 * joystick or touchpad, the pull of a trigger, or the movement of a gyroscope.
 */
class Axis extends input_1.Input {
    constructor(params) {
        super(params);
        this.state = 0;
        /**
         * Ignores inputs of magnitude less than this value (0 to 1).
         */
        this.deadzone = 0.05;
        const { deadzone } = params ?? {};
        if (deadzone)
            this.deadzone = deadzone;
    }
    get active() {
        return Math.abs(this.state) > this.deadzone;
    }
    /**
     * Returns the axis position, ignoring the deadzone value.
     */
    get force() {
        return this.active ? this.state : 0;
    }
    /**
     * Returns an absolute axis position.
     */
    get magnitude() {
        const magnitude = Math.abs(this.force);
        if (magnitude < this.deadzone)
            return 0;
        return (magnitude - this.deadzone) / (1 - this.deadzone);
    }
}
exports.Axis = Axis;
//# sourceMappingURL=axis.js.map