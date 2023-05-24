import { Input } from "../input";
import { Magnitude } from "../math";
import { Momentary } from "./momentary";
export declare class Trigger extends Input<Magnitude> {
    state: Magnitude;
    button: Momentary;
    get active(): boolean;
    get pressure(): Magnitude;
    get magnitude(): Magnitude;
    changes(state: Magnitude): boolean;
}
//# sourceMappingURL=trigger.d.ts.map