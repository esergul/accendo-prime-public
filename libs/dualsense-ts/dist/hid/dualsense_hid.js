"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DualsenseHID = void 0;
const SCOPE_A = 1;
const SCOPE_B = 2;
/** Coordinates a HIDProvider and tracks the latest HID state */
class DualsenseHID {
    constructor(provider, refreshRate = 30) {
        this.provider = provider;
        /** Subscribers waiting for HID state updates */
        this.subscribers = new Set();
        /** Subscribers waiting for error updates */
        this.errorSubscribers = new Set();
        /** Queue of pending HID commands */
        this.pendingCommands = [];
        /** Most recent HID state of the device */
        this.state = {
            ["LX" /* InputId.LeftAnalogX */]: 0,
            ["LY" /* InputId.LeftAnalogY */]: 0,
            ["RX" /* InputId.RightAnalogX */]: 0,
            ["RY" /* InputId.RightAnalogY */]: 0,
            ["L2" /* InputId.LeftTrigger */]: 0,
            ["R2" /* InputId.RightTrigger */]: 0,
            ["Triangle" /* InputId.Triangle */]: false,
            ["Circle" /* InputId.Circle */]: false,
            ["Cross" /* InputId.Cross */]: false,
            ["Square" /* InputId.Square */]: false,
            ["Dpad" /* InputId.Dpad */]: 0,
            ["Up" /* InputId.Up */]: false,
            ["Down" /* InputId.Down */]: false,
            ["Left" /* InputId.Left */]: false,
            ["Right" /* InputId.Right */]: false,
            ["R3" /* InputId.RightAnalogButton */]: false,
            ["L3" /* InputId.LeftAnalogButton */]: false,
            ["Options" /* InputId.Options */]: false,
            ["Create" /* InputId.Create */]: false,
            ["R2Button" /* InputId.RightTriggerButton */]: false,
            ["L2Button" /* InputId.LeftTriggerButton */]: false,
            ["R1" /* InputId.RightBumper */]: false,
            ["L1" /* InputId.LeftBumper */]: false,
            ["Playstation" /* InputId.Playstation */]: false,
            ["TouchButton" /* InputId.TouchButton */]: false,
            ["Mute" /* InputId.Mute */]: false,
            ["Status" /* InputId.Status */]: false,
            ["TouchX0" /* InputId.TouchX0 */]: 0,
            ["TouchY0" /* InputId.TouchY0 */]: 0,
            ["TouchContact0" /* InputId.TouchContact0 */]: false,
            ["TouchId0" /* InputId.TouchId0 */]: 0,
            ["TouchX1" /* InputId.TouchX1 */]: 0,
            ["TouchY1" /* InputId.TouchY1 */]: 0,
            ["TouchContact1" /* InputId.TouchContact1 */]: false,
            ["TouchId1" /* InputId.TouchId1 */]: 0,
            ["GyroX" /* InputId.GyroX */]: 0,
            ["GyroY" /* InputId.GyroY */]: 0,
            ["GyroZ" /* InputId.GyroZ */]: 0,
            ["AccelX" /* InputId.AccelX */]: 0,
            ["AccelY" /* InputId.AccelY */]: 0,
            ["AccelZ" /* InputId.AccelZ */]: 0,
        };
        provider.onData = this.set.bind(this);
        provider.onError = this.handleError.bind(this);
        setInterval(() => {
            if (this.pendingCommands.length > 0) {
                (async () => {
                    const command = [...this.pendingCommands];
                    this.pendingCommands = [];
                    await provider.write(DualsenseHID.buildFeatureReport(command));
                })().catch((err) => {
                    this.handleError(new Error(`HID write failed: ${JSON.stringify(err)}`));
                });
            }
        }, 1000 / refreshRate);
    }
    /** Register a handler for HID state updates */
    register(callback) {
        this.subscribers.add(callback);
    }
    /** Cancel a previously registered handler */
    unregister(callback) {
        this.subscribers.delete(callback);
    }
    /** Add a subscriber for errors */
    on(type, callback) {
        if (type === "error")
            this.errorSubscribers.add(callback);
    }
    /** Update the HID state and pass it along to all state subscribers */
    set(state) {
        this.state = state;
        this.subscribers.forEach((callback) => callback(state));
    }
    /** Pass errors along to all error subscribers */
    handleError(error) {
        this.errorSubscribers.forEach((callback) => callback(error));
    }
    /** Condense all pending commands into one HID feature report */
    static buildFeatureReport(events) {
        const report = new Uint8Array(46).fill(0);
        report[0] = 0x2;
        report[1] = events
            .filter(({ scope: { index } }) => index === SCOPE_A)
            .reduce((acc, { scope: { value } }) => {
            return acc | value;
        }, 0x00);
        report[2] = events
            .filter(({ scope: { index } }) => index === SCOPE_B)
            .reduce((acc, { scope: { value } }) => {
            return acc | value;
        }, 0x00);
        events.forEach(({ values }) => {
            values.forEach(({ index, value }) => {
                report[index] = value;
            });
        });
        return report;
    }
    /** Set intensity for left and right rumbles */
    setRumble(left, right) {
        this.pendingCommands.push({
            scope: {
                index: SCOPE_A,
                value: 2 /* CommandScopeA.PrimaryRumble */ | 1 /* CommandScopeA.HapticRumble */,
            },
            values: [
                { index: 3, value: right },
                { index: 4, value: left },
            ],
        });
        this.pendingCommands.push({
            scope: { index: SCOPE_B, value: 64 /* CommandScopeB.MotorPower */ },
            values: [],
        });
    }
    /** Set left trigger resistance and behavior */
    setLeftTriggerFeedback(mode, forces) {
        this.pendingCommands.push({
            scope: { index: SCOPE_A, value: 8 /* CommandScopeA.LeftTriggerFeedback */ },
            values: [
                { index: 22, value: mode },
                ...forces.map((force, index) => ({ index: 23 + index, value: force })),
            ],
        });
    }
    /** Set right trigger resistance and behavior */
    setRightTriggerFeedback(mode, forces) {
        this.pendingCommands.push({
            scope: { index: SCOPE_A, value: 4 /* CommandScopeA.RightTriggerFeedback */ },
            values: [
                { index: 11, value: mode },
                ...forces.map((force, index) => ({ index: 12 + index, value: force })),
            ],
        });
    }
    /** Set microphone LED brightness */
    setMicrophoneLED(brightness) {
        this.pendingCommands.push({
            scope: { index: SCOPE_B, value: 1 /* CommandScopeB.MicrophoneLED */ },
            values: [{ index: 9, value: brightness }],
        });
    }
    /** Set player ID LEDs */
    setPlayerId(id) {
        this.pendingCommands.push({
            scope: { index: SCOPE_B, value: 16 /* CommandScopeB.PlayerLeds */ },
            values: [{ index: 44, value: id }],
        });
    }
}
exports.DualsenseHID = DualsenseHID;
//# sourceMappingURL=dualsense_hid.js.map