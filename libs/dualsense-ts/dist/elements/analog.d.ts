import { Axis, AxisParams } from "./axis";
import { Momentary } from "./momentary";
import { Input, InputParams } from "../input";
import { Radians, Degrees, Magnitude, Force } from "../math";
/** Configuration for an analog joystick and nested inputs */
export interface AnalogParams extends InputParams {
    /** Configuration for the input's button */
    button?: InputParams;
    /** Configuration for the input's x axis */
    x?: AxisParams;
    /** Configuration for the input's y axis */
    y?: AxisParams;
    /** Ignore input of magnitude less than or equal to this value */
    deadzone?: Magnitude;
}
/**
 * Represents an analog joystick.
 *
 * The joystick is abstracted to a unit circle.
 * - At rest, the stick's coordinates are [0,0]
 * - Pushed all the way to the right, the stick's coordinates are [1,0]
 * - Pushed all the way down and to the left, the stick's coordinates are [-1, -1]
 */
export declare class Analog extends Input<Analog> {
    readonly state: this;
    /** The left/right position of the input */
    readonly x: Axis;
    /** The up/down position of the input */
    readonly y: Axis;
    /** Button triggered by pressing the stick */
    readonly button: Momentary;
    /** Ignores stick movement below this value (0 to 1) */
    deadzone: Magnitude;
    constructor(params?: AnalogParams);
    /**
     * Returns true if the stick is away from the idle position, or the button is pressed.
     */
    get active(): boolean;
    /**
     * Returns a direction and magnitude representing the stick's position.
     */
    get vector(): {
        direction: Radians;
        magnitude: Magnitude;
    };
    /**
     * Returns a force from the stick's position.
     * This ignores the deadzone value.
     */
    get force(): Force;
    /**
     * Returns a magnitude from the stick's position.
     */
    get magnitude(): Magnitude;
    /**
     * Returns the stick's angle in radians.
     */
    get direction(): Radians;
    /**
     * Alias for `.direction`
     */
    get radians(): Radians;
    /**
     * Alias for `.direction`
     */
    get angle(): Radians;
    /**
     * Alias for `.direction` converted to degrees.
     */
    get directionDegrees(): Degrees;
    /**
     * Alias for `.directionDegrees`.
     */
    get degrees(): Degrees;
    /**
     * Alias for `.directionDegrees`.
     */
    get angleDegrees(): Degrees;
}
//# sourceMappingURL=analog.d.ts.map