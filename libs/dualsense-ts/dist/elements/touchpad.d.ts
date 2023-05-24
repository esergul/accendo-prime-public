import { Momentary } from "./momentary";
import { Touch } from "./touch";
import { Input, InputParams } from "../input";
export declare class Touchpad extends Input<Touchpad> {
    readonly state: this;
    get active(): boolean;
    readonly button: Momentary;
    readonly left: Touch;
    readonly right: Touch;
    constructor(params: InputParams);
}
//# sourceMappingURL=touchpad.d.ts.map