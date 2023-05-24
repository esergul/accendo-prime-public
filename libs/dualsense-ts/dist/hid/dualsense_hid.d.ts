import { TriggerMode, PlayerID } from "./command";
import { HIDProvider, DualsenseHIDState } from "./hid_provider";
export type HIDCallback = (state: DualsenseHIDState) => void;
export type ErrorCallback = (error: Error) => void;
/** Coordinates a HIDProvider and tracks the latest HID state */
export declare class DualsenseHID {
    readonly provider: HIDProvider;
    /** Subscribers waiting for HID state updates */
    private readonly subscribers;
    /** Subscribers waiting for error updates */
    private readonly errorSubscribers;
    /** Queue of pending HID commands */
    private pendingCommands;
    /** Most recent HID state of the device */
    state: DualsenseHIDState;
    constructor(provider: HIDProvider, refreshRate?: number);
    /** Register a handler for HID state updates */
    register(callback: HIDCallback): void;
    /** Cancel a previously registered handler */
    unregister(callback: HIDCallback): void;
    /** Add a subscriber for errors */
    on(type: "error" | string, callback: ErrorCallback): void;
    /** Update the HID state and pass it along to all state subscribers */
    private set;
    /** Pass errors along to all error subscribers */
    private handleError;
    /** Condense all pending commands into one HID feature report */
    private static buildFeatureReport;
    /** Set intensity for left and right rumbles */
    setRumble(left: number, right: number): void;
    /** Set left trigger resistance and behavior */
    setLeftTriggerFeedback(mode: TriggerMode, forces: number[]): void;
    /** Set right trigger resistance and behavior */
    setRightTriggerFeedback(mode: TriggerMode, forces: number[]): void;
    /** Set microphone LED brightness */
    setMicrophoneLED(brightness: number): void;
    /** Set player ID LEDs */
    setPlayerId(id: PlayerID): void;
}
//# sourceMappingURL=dualsense_hid.d.ts.map