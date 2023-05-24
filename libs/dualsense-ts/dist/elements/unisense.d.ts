import { Trigger } from "./trigger";
import { Momentary } from "./momentary";
import { Analog, AnalogParams } from "./analog";
import { Input, InputParams } from "../input";
import { Intensity } from "math";
/** Settings for the trigger, bumpers, and analog stick on one side of the controller */
export interface UnisenseParams extends InputParams {
    /** Settings for a trigger */
    trigger?: InputParams;
    /** Settings for a bumper button */
    bumper?: InputParams;
    /** Settings for an analog stick */
    analog?: AnalogParams;
}
/** One half of the controller */
export declare class Unisense extends Input<Unisense> {
    readonly state: this;
    readonly trigger: Trigger;
    readonly bumper: Momentary;
    readonly analog: Analog;
    private rumbleIntensity;
    constructor(params?: UnisenseParams);
    /** Check or adjust rumble intensity for one side of the controller */
    rumble(intensity?: Intensity | boolean): Intensity;
    get active(): boolean;
}
//# sourceMappingURL=unisense.d.ts.map