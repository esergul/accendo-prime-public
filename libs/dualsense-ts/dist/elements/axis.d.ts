import { Input, InputParams } from "../input";
import { Force, Magnitude } from "../math";
/**
 * Configuration for an Axis input.
 */
export interface AxisParams extends InputParams {
    deadzone?: Magnitude;
}
/**
 * Represents a simple ranged input. For example, one axis of an analog
 * joystick or touchpad, the pull of a trigger, or the movement of a gyroscope.
 */
export declare class Axis extends Input<Force> {
    state: Force;
    /**
     * Ignores inputs of magnitude less than this value (0 to 1).
     */
    deadzone: Magnitude;
    constructor(params?: AxisParams);
    get active(): boolean;
    /**
     * Returns the axis position, ignoring the deadzone value.
     */
    get force(): Force;
    /**
     * Returns an absolute axis position.
     */
    get magnitude(): Magnitude;
}
//# sourceMappingURL=axis.d.ts.map