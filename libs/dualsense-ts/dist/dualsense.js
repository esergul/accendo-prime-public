"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dualsense = void 0;
const elements_1 = require("./elements");
const input_1 = require("./input");
const hid_1 = require("./hid");
/** Represents a Dualsense controller */
class Dualsense extends input_1.Input {
    get active() {
        return Object.values(this).some((input) => input !== this && input instanceof input_1.Input && input.active);
    }
    constructor(params = {}) {
        super(params);
        this.state = this;
        this.ps = new elements_1.Momentary({
            icon: "㎰",
            name: "Home",
            ...(params.ps ?? {}),
        });
        this.mute = new elements_1.Mute({
            icon: "🕩",
            name: "Mute",
            ...(params.mute ?? {}),
        });
        this.options = new elements_1.Momentary({
            icon: "⋯",
            name: "Options",
            ...(params.options ?? {}),
        });
        this.create = new elements_1.Momentary({
            icon: "🖉",
            name: "Create",
            ...(params.create ?? {}),
        });
        this.triangle = new elements_1.Momentary({
            icon: "🟕",
            name: "Triangle",
            ...(params.triangle ?? {}),
        });
        this.circle = new elements_1.Momentary({
            icon: "⊚",
            name: "Circle",
            ...(params.circle ?? {}),
        });
        this.cross = new elements_1.Momentary({
            icon: "⮿",
            name: "Cross",
            ...(params.cross ?? {}),
        });
        this.square = new elements_1.Momentary({
            icon: "🟗",
            name: "Square",
            ...(params.square ?? {}),
        });
        this.dpad = new elements_1.Dpad({
            icon: "D",
            name: "D-pad",
            ...(params.dpad ?? {}),
        });
        this.left = new elements_1.Unisense({
            icon: "L",
            name: "Left",
            ...(params.left ?? {}),
        });
        this.right = new elements_1.Unisense({
            icon: "R",
            name: "Right",
            ...(params.right ?? {}),
        });
        this.touchpad = new elements_1.Touchpad({
            icon: "⎚",
            name: "Touchpad",
            ...(params.touchpad ?? {}),
        });
        this.connection = new elements_1.Momentary({
            icon: "🔗",
            name: "Connected",
            ...(params.square ?? {}),
        });
        this.connection[input_1.InputSet](false);
        this.hid = params.hid ?? new hid_1.DualsenseHID(new hid_1.PlatformHIDProvider());
        this.hid.register((state) => {
            this.processHID(state);
        });
        /** Refresh connection state */
        setInterval(() => {
            const { provider: { connected }, } = this.hid;
            this.connection[input_1.InputSet](connected);
            if (!connected)
                this.hid.provider.connect();
        }, 200);
        /** Refresh rumble state */
        const rumbleMemo = { left: -1, right: -1 };
        setInterval(() => {
            const left = this.left.rumble();
            const right = this.right.rumble();
            if (this.connection.active &&
                (left !== rumbleMemo.left || right !== rumbleMemo.right)) {
                this.hid.setRumble(left * 255, right * 255);
                rumbleMemo.left = left;
                rumbleMemo.right = right;
            }
        }, 1000 / 30);
    }
    get rumbleIntensity() {
        return (this.left.rumble() + this.right.rumble()) / 2;
    }
    /** Check or adjust rumble intensity evenly across both sides of the controller */
    rumble(intensity) {
        this.left.rumble(intensity);
        this.right.rumble(intensity);
        return this.rumbleIntensity;
    }
    /** Distributes HID event values to the controller's inputs */
    processHID(state) {
        this.ps[input_1.InputSet](state["Playstation" /* InputId.Playstation */]);
        this.options[input_1.InputSet](state["Options" /* InputId.Options */]);
        this.create[input_1.InputSet](state["Create" /* InputId.Create */]);
        this.mute[input_1.InputSet](state["Mute" /* InputId.Mute */]);
        this.mute.status[input_1.InputSet](state["Status" /* InputId.Status */]);
        this.triangle[input_1.InputSet](state["Triangle" /* InputId.Triangle */]);
        this.circle[input_1.InputSet](state["Circle" /* InputId.Circle */]);
        this.cross[input_1.InputSet](state["Cross" /* InputId.Cross */]);
        this.square[input_1.InputSet](state["Square" /* InputId.Square */]);
        this.dpad.up[input_1.InputSet](state["Up" /* InputId.Up */]);
        this.dpad.down[input_1.InputSet](state["Down" /* InputId.Down */]);
        this.dpad.right[input_1.InputSet](state["Right" /* InputId.Right */]);
        this.dpad.left[input_1.InputSet](state["Left" /* InputId.Left */]);
        this.touchpad.button[input_1.InputSet](state["TouchButton" /* InputId.TouchButton */]);
        this.touchpad.left.x[input_1.InputSet](state["TouchX0" /* InputId.TouchX0 */]);
        this.touchpad.left.y[input_1.InputSet](state["TouchY0" /* InputId.TouchY0 */]);
        this.touchpad.left.contact[input_1.InputSet](state["TouchContact0" /* InputId.TouchContact0 */]);
        this.touchpad.left.tracker[input_1.InputSet](state["TouchId0" /* InputId.TouchId0 */]);
        this.touchpad.right.x[input_1.InputSet](state["TouchX1" /* InputId.TouchX1 */]);
        this.touchpad.right.y[input_1.InputSet](state["TouchY1" /* InputId.TouchY1 */]);
        this.touchpad.right.contact[input_1.InputSet](state["TouchContact1" /* InputId.TouchContact1 */]);
        this.touchpad.right.tracker[input_1.InputSet](state["TouchId1" /* InputId.TouchId1 */]);
        this.left.analog.x[input_1.InputSet](state["LX" /* InputId.LeftAnalogX */]);
        this.left.analog.y[input_1.InputSet](state["LY" /* InputId.LeftAnalogY */]);
        this.left.bumper[input_1.InputSet](state["L1" /* InputId.LeftBumper */]);
        this.left.trigger[input_1.InputSet](state["L2" /* InputId.LeftTrigger */]);
        this.left.trigger.button[input_1.InputSet](state["L2Button" /* InputId.LeftTriggerButton */]);
        this.right.analog.x[input_1.InputSet](state["RX" /* InputId.RightAnalogX */]);
        this.right.analog.y[input_1.InputSet](state["RY" /* InputId.RightAnalogY */]);
        this.right.bumper[input_1.InputSet](state["R1" /* InputId.RightBumper */]);
        this.right.trigger[input_1.InputSet](state["R2" /* InputId.RightTrigger */]);
        this.right.trigger.button[input_1.InputSet](state["R2Button" /* InputId.RightTriggerButton */]);
    }
}
exports.Dualsense = Dualsense;
//# sourceMappingURL=dualsense.js.map