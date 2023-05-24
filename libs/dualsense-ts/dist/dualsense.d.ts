import { Momentary, Dpad, DpadParams, Mute, Unisense, UnisenseParams, Touchpad } from "./elements";
import { Input, InputParams } from "./input";
import { DualsenseHID } from "./hid";
import { Intensity } from "./math";
/** Settings for your Dualsense controller and each of its inputs */
export interface DualsenseParams extends InputParams {
    /** Sets the source for HID events. Default: decide automatically */
    hid?: DualsenseHID | null;
    /** Settings for the Playstation button */
    ps?: InputParams;
    /** Settings for the mute button */
    mute?: InputParams;
    /** Settings for the options button */
    options?: InputParams;
    /** Settings for the create button */
    create?: InputParams;
    /** Settings for the triangle button */
    triangle?: InputParams;
    /** Settings for the circle button */
    circle?: InputParams;
    /** Settings for the cross button */
    cross?: InputParams;
    /** Settings for the square button */
    square?: InputParams;
    /** Settings for the dpad buttons */
    dpad?: DpadParams;
    /** Settings for inputs on the left half of the controller */
    left?: UnisenseParams;
    /** Settings for inputs on the right side of the controller */
    right?: UnisenseParams;
    /** Settings for the touchpad inputs */
    touchpad?: InputParams;
}
/** Represents a Dualsense controller */
export declare class Dualsense extends Input<Dualsense> {
    readonly state: Dualsense;
    /** The Playstation button */
    readonly ps: Momentary;
    /** The mute button and status light */
    readonly mute: Mute;
    /** The options button */
    readonly options: Momentary;
    /** The create button */
    readonly create: Momentary;
    /** The triangle button */
    readonly triangle: Momentary;
    /** The circle button */
    readonly circle: Momentary;
    /** The cross, or X button */
    readonly cross: Momentary;
    /** The square button */
    readonly square: Momentary;
    /** The up/down/left/right dpad buttons */
    readonly dpad: Dpad;
    /** Inputs on the left half of the controller */
    readonly left: Unisense;
    /** Inputs on the right half of the controller */
    readonly right: Unisense;
    /** The touchpad; works like an analog stick */
    readonly touchpad: Touchpad;
    /** Represents the underlying HID device. Provides input events */
    readonly hid: DualsenseHID;
    /** A virtual button representing whether or not a controller is connected */
    readonly connection: Momentary;
    get active(): boolean;
    constructor(params?: DualsenseParams);
    private get rumbleIntensity();
    /** Check or adjust rumble intensity evenly across both sides of the controller */
    rumble(intensity?: Intensity): number;
    /** Distributes HID event values to the controller's inputs */
    private processHID;
}
//# sourceMappingURL=dualsense.d.ts.map