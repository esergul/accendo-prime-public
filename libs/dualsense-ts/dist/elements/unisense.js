"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unisense = void 0;
const trigger_1 = require("./trigger");
const momentary_1 = require("./momentary");
const analog_1 = require("./analog");
const input_1 = require("../input");
// The name "Dualsense" clearly implies a composition of two Unisense elements 🤔
/** One half of the controller */
class Unisense extends input_1.Input {
    constructor(params = {}) {
        super(params);
        this.state = this;
        this.rumbleIntensity = 0;
        const { trigger, bumper, analog } = params;
        this.trigger = new trigger_1.Trigger({
            icon: "2",
            name: "Trigger",
            threshold: 1 / 255,
            ...trigger,
        });
        this.bumper = new momentary_1.Momentary({ icon: "1", name: "Bumper", ...bumper });
        this.analog = new analog_1.Analog({
            icon: "⨁",
            name: "Analog",
            threshold: 1 / 128,
            deadzone: 8 / 128,
            ...analog,
        });
    }
    /** Check or adjust rumble intensity for one side of the controller */
    rumble(intensity) {
        if (typeof intensity === "number")
            this.rumbleIntensity = Math.max(Math.min(intensity, 1), 0);
        if (intensity === false)
            this.rumbleIntensity = 0;
        if (intensity === true)
            this.rumbleIntensity = 1;
        return this.rumbleIntensity;
    }
    get active() {
        return this.trigger.active || this.bumper.active || this.analog.active;
    }
}
exports.Unisense = Unisense;
//# sourceMappingURL=unisense.js.map