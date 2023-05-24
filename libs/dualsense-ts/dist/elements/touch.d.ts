import { Analog } from "./analog";
import { Increment } from "./increment";
/**
 * Represents a touchpad touch, treated like an analog joystick input
 * with [0,0] representing the center of the touchpad.
 */
export declare class Touch extends Analog {
    readonly state: this;
    readonly contact: import("./momentary").Momentary;
    readonly tracker: Increment;
    deadzone: number;
    get active(): boolean;
}
//# sourceMappingURL=touch.d.ts.map