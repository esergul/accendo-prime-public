import { InputId } from "./id";
export { InputId } from "./id";
/** Basic settings for any controller input */
export interface InputParams {
    /** User-friendly name for the input */
    name?: string;
    /** Icon representing the input */
    icon?: string;
    /** Ignore changes numeric inputs less than this value */
    threshold?: number;
    /** Ignore numeric inputs below this value */
    deadzone?: number;
}
/** Track inputs on button press, release, or both */
export type InputChangeType = "change" | "press" | "release";
/** Keys representing possible input events */
export type InputEventType = InputChangeType | "input";
/** Callback for recieving controller input changes */
export type InputCallback<Instance> = (input: Instance, changed: Instance | Input<unknown>) => unknown | Promise<unknown>;
/** Symbol for modifying the comparison function used by Inputs */
export declare const InputSetComparator: unique symbol;
/** Symbol for modifying the current value of an Input */
export declare const InputSet: unique symbol;
/** Symbol for accessing the name of an Input */
export declare const InputName: unique symbol;
/** Symbole for accessing the icon of an Input */
export declare const InputIcon: unique symbol;
/** Symbol for accessing an Input's event subscriber callbacks */
declare const InputOns: unique symbol;
/** Symbol for accessing an Input's single-time subscriber callbacks */
declare const InputOnces: unique symbol;
/** Symbol for notifying an Input that it has a parent */
declare const InputAdopt: unique symbol;
/** Symbol for accessing an Input's parent Inputs */
declare const InputParents: unique symbol;
/** Symbol for accessing the comparison function used by an Input */
declare const InputComparator: unique symbol;
/**
 * Input manages the state of a single device input,
 * a virtual input, or a group of Input children.
 */
export declare abstract class Input<Type> implements AsyncIterator<Input<Type>> {
    readonly id: InputId;
    /** For numeric inputs, ignore state changes smaller than this threshold */
    threshold: number;
    /** For numeric inputs, ignore states smaller than this deadzone */
    deadzone: number;
    /** The current value of this input */
    abstract state: Type;
    /** Stores event listeners */
    private [InputOns];
    /** Stores callbacks waiting for one-time events */
    private [InputOnces];
    constructor(params?: InputParams);
    /** Returns true if this input or any nested inputs are currently in use */
    abstract get active(): boolean;
    /** Register a callback to recieve state updates from this Input */
    on(event: InputEventType, listener: InputCallback<this>): this;
    /** Register a callback to recieve the next specified update */
    once(event: InputChangeType, listener: InputCallback<this>): this;
    /** Notify listeners and parents of a state change */
    private emit;
    /** Notify one-time listeners of a state change */
    private emitOnce;
    /** Register a callback to recieve state updates from this Input */
    addEventListener(event: InputEventType, listener: InputCallback<this>, { once }?: {
        once: boolean;
    }): this;
    /** Resolves on the next change to this input's state */
    next(type?: InputChangeType): Promise<IteratorResult<this>>;
    /** Resolves on the next change to this input's state */
    promise(type?: "press" | "release" | "change"): Promise<this>;
    /** Render a debugging string */
    toString(): string;
    /** Returns true if the provided state is worth an event */
    [InputComparator]: (state: Type, newState: Type) => boolean;
    [Symbol.asyncIterator](): AsyncIterator<this>;
    [Symbol.toPrimitive](hint: "number" | "string" | "default"): number | string;
    get [Symbol.toStringTag](): string;
    /** The name of this input */
    readonly [InputName]: string;
    /** A short name for this input */
    readonly [InputIcon]: string;
    /** Other Inputs that contain this one */
    private [InputParents];
    /** Links Inputs to bubble up events */
    [InputAdopt](parent: Input<unknown>): void;
    /** Sets a default comparison type for the Input */
    [InputSetComparator](): void;
    /** Update the input's state and trigger all necessary callbacks */
    [InputSet](state: Type): void;
}
//# sourceMappingURL=input.d.ts.map