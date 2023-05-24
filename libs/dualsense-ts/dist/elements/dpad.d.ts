import { Momentary } from "./momentary";
import { Input, InputParams } from "../input";
export interface DpadParams extends InputParams {
    up?: InputParams;
    down?: InputParams;
    left?: InputParams;
    right?: InputParams;
}
export declare class Dpad extends Input<Dpad> {
    readonly state: this;
    readonly up: Momentary;
    readonly down: Momentary;
    readonly left: Momentary;
    readonly right: Momentary;
    constructor(params?: DpadParams);
    get active(): boolean;
}
//# sourceMappingURL=dpad.d.ts.map