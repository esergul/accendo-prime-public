"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.InputIcon = exports.InputName = exports.InputSet = exports.InputSetComparator = void 0;
const comparators_1 = require("./comparators");
/** Symbol for modifying the comparison function used by Inputs */
exports.InputSetComparator = Symbol("InputSetComparator");
/** Symbol for modifying the current value of an Input */
exports.InputSet = Symbol("InputSet");
/** Symbol for accessing the name of an Input */
exports.InputName = Symbol("InputName");
/** Symbole for accessing the icon of an Input */
exports.InputIcon = Symbol("InputIcon");
/** Symbol for accessing an Input's event subscriber callbacks */
const InputOns = Symbol("InputOns");
/** Symbol for accessing an Input's single-time subscriber callbacks */
const InputOnces = Symbol("InputOnces");
/** Symbol for notifying an Input that it has a parent */
const InputAdopt = Symbol("InputAdopt");
/** Symbol for accessing an Input's parent Inputs */
const InputParents = Symbol("InputParents");
/** Symbol for accessing the comparison function used by an Input */
const InputComparator = Symbol("InputComparator");
/**
 * Input manages the state of a single device input,
 * a virtual input, or a group of Input children.
 */
class Input {
    constructor(params = {}) {
        this.id = "Unknown" /* InputId.Unknown */;
        /** For numeric inputs, ignore state changes smaller than this threshold */
        this.threshold = 0;
        /** For numeric inputs, ignore states smaller than this deadzone */
        this.deadzone = 0;
        /** Stores event listeners */
        this[_a] = new Map();
        /** Stores callbacks waiting for one-time events */
        this[_b] = new Map();
        /** Returns true if the provided state is worth an event */
        this[_c] = comparators_1.BasicComparator;
        /** The name of this input */
        this[_d] = "Unknown Input";
        /** A short name for this input */
        this[_e] = "???";
        /** Other Inputs that contain this one */
        this[_f] = new Set();
        const { name, icon, threshold, deadzone } = params;
        if (name)
            this[exports.InputName] = name;
        if (icon)
            this[exports.InputIcon] = icon;
        if (threshold)
            this.threshold = threshold;
        if (deadzone)
            this.deadzone = deadzone;
        setTimeout(() => {
            this[exports.InputSetComparator]();
            Object.values(this).forEach((value) => {
                if (value === this)
                    return;
                if (value instanceof Input)
                    value[InputAdopt](this);
            });
        });
    }
    /** Register a callback to recieve state updates from this Input */
    on(event, listener) {
        const listeners = this[InputOns].get(event);
        if (!listeners) {
            this[InputOns].set(event, []);
            return this.on(event, listener);
        }
        listeners.push(listener);
        return this;
    }
    /** Register a callback to recieve the next specified update */
    once(event, listener) {
        const listeners = this[InputOnces].get(event);
        if (!listeners) {
            this[InputOnces].set(event, []);
            return this.once(event, listener);
        }
        listeners.push(listener);
        return this;
    }
    /** Notify listeners and parents of a state change */
    emit(event, changed) {
        const listeners = this[InputOns].get(event) ?? [];
        listeners.forEach((callback) => {
            callback(this, changed);
        });
        if (event !== "input") {
            this.emitOnce(event, changed);
            this[InputParents].forEach((input) => {
                input.emit(event, changed);
            });
        }
    }
    /** Notify one-time listeners of a state change */
    emitOnce(event, changed = this) {
        const listeners = this[InputOnces].get(event) ?? [];
        this[InputOnces].set(event, []);
        listeners.forEach((callback) => {
            callback(this, changed);
        });
    }
    /** Register a callback to recieve state updates from this Input */
    addEventListener(event, listener, { once } = { once: false }) {
        if (once) {
            if (event === "input") {
                throw new Error("Can't listen once to `input` events");
            }
            return this.once(event, listener);
        }
        return this.on(event, listener);
    }
    /** Resolves on the next change to this input's state */
    next(type = "change") {
        return new Promise((resolve) => {
            this.once(type, () => {
                resolve({ value: this, done: false });
            });
        });
    }
    /** Resolves on the next change to this input's state */
    promise(type = "change") {
        return new Promise((resolve) => {
            this.once(type, () => resolve(this));
        });
    }
    /** Render a debugging string */
    get name(){
        return this[exports.InputName];
    }
    toString() {
        return `${this[exports.InputIcon]} [${this.active ? "X" : "_"}]`;
    }
    [(_a = InputOns, _b = InputOnces, _c = InputComparator, Symbol.asyncIterator)]() {
        return this;
    }
    [Symbol.toPrimitive](hint) {
        if (hint === "string")
            return String(this.state);
        if (typeof this.state === "number")
            return this.state;
        return Number(this.state);
    }
    get [Symbol.toStringTag]() {
        return this.toString();
    }
    /** Links Inputs to bubble up events */
    [(_d = exports.InputName, _e = exports.InputIcon, _f = InputParents, InputAdopt)](parent) {
        this[InputParents].add(parent);
    }
    /** Sets a default comparison type for the Input */
    [exports.InputSetComparator]() {
        if (typeof this.state === "number") {
            this[InputComparator] = comparators_1.ThresholdComparator.bind(this, this.threshold, this.deadzone);
        }
        else if (this.state instanceof Input) {
            this[InputComparator] = comparators_1.VirtualComparator;
        }
        else {
            this[InputComparator] = comparators_1.BasicComparator;
        }
    }
    /** Update the input's state and trigger all necessary callbacks */
    [exports.InputSet](state) {
        if (this[InputComparator](this.state, state)) {
            this.state = state;
            this.emit("change", this);
            if (typeof state === "boolean")
                this.emit(state ? "press" : "release", this);
        }
        this.emit("input", this);
    }
}
exports.Input = Input;
//# sourceMappingURL=input.js.map