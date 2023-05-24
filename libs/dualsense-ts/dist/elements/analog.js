"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analog = void 0;
const axis_1 = require("./axis");
const momentary_1 = require("./momentary");
const input_1 = require("../input");
/**
 * Represents an analog joystick.
 *
 * The joystick is abstracted to a unit circle.
 * - At rest, the stick's coordinates are [0,0]
 * - Pushed all the way to the right, the stick's coordinates are [1,0]
 * - Pushed all the way down and to the left, the stick's coordinates are [-1, -1]
 */
class Analog extends input_1.Input {
    constructor(params) {
        super(params);
        this.state = this;
        /** Ignores stick movement below this value (0 to 1) */
        this.deadzone = 0.05;
        const { button, x, y, deadzone } = params ?? {};
        if (deadzone)
            this.deadzone = deadzone;
        this.button = new momentary_1.Momentary({ icon: "3", name: "Button", ...button });
        this.x = new axis_1.Axis({
            icon: "↔",
            name: "X",
            ...params,
            ...x,
        });
        this.y = new axis_1.Axis({
            icon: "↕",
            name: "Y",
            ...params,
            ...y,
        });
    }
    /**
     * Returns true if the stick is away from the idle position, or the button is pressed.
     */
    get active() {
        return this.magnitude > 0 || this.button.active;
    }
    /**
     * Returns a direction and magnitude representing the stick's position.
     */
    get vector() {
        return { direction: this.direction, magnitude: this.magnitude };
    }
    /**
     * Returns a force from the stick's position.
     * This ignores the deadzone value.
     */
    get force() {
        return Math.max(Math.min(Math.hypot(this.x.force, this.y.force), 1), -1);
    }
    /**
     * Returns a magnitude from the stick's position.
     */
    get magnitude() {
        const magnitude = Math.abs(this.force);
        if (magnitude < this.deadzone)
            return 0;
        return (magnitude - this.deadzone) / (1 - this.deadzone);
    }
    /**
     * Returns the stick's angle in radians.
     */
    get direction() {
        return Math.atan2(this.y.force, this.x.force);
    }
    /**
     * Alias for `.direction`
     */
    get radians() {
        return this.direction;
    }
    /**
     * Alias for `.direction`
     */
    get angle() {
        return this.direction;
    }
    /**
     * Alias for `.direction` converted to degrees.
     */
    get directionDegrees() {
        return (this.direction * 180) / Math.PI;
    }
    /**
     * Alias for `.directionDegrees`.
     */
    get degrees() {
        return this.directionDegrees;
    }
    /**
     * Alias for `.directionDegrees`.
     */
    get angleDegrees() {
        return this.directionDegrees;
    }
}
exports.Analog = Analog;
//# sourceMappingURL=analog.js.map