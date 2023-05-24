export declare const enum LedOptions {
    Off = 0,
    PlayerLedBrightness = 1,
    Uninterruptible = 2,
    Both = 3
}
export declare const enum PulseOptions {
    Off = 0,
    FadeBlue = 1,
    FadeOut = 2
}
export declare const enum Brightness {
    High = 0,
    Medium = 1,
    Low = 2
}
export declare const enum PlayerID {
    Player1 = 4,
    Player2 = 10,
    Player3 = 21,
    Player4 = 27,
    All = 31
}
export declare const enum TriggerMode {
    /** No resistance */
    Off = 0,
    /** Continuous resistance */
    Rigid = 1,
    Pulse = 2,
    Calibration = 252,
    rigid_A = 33,
    rigid_B = 5,
    rigid_AB = 37,
    pulse_A = 34,
    pulse_B = 6,
    pulse_AB = 38
}
export declare const enum CommandScopeA {
    HapticRumble = 1,
    PrimaryRumble = 2,
    RightTriggerFeedback = 4,
    LeftTriggerFeedback = 8,
    AudioVolume = 16,
    SpeakerToggle = 32,
    MicrophoneVolume = 64
}
export declare const enum CommandScopeB {
    MicrophoneLED = 1,
    Mute = 2,
    TouchpadLeds = 4,
    DisableLeds = 8,
    PlayerLeds = 16,
    MotorPower = 64
}
export type CommandScope = CommandScopeA | CommandScopeB;
/** Byte value, 0 to 255 */
type Intensity = number;
/** 48 byte packet that is sent to the controller to update LEDs, rumble, etc */
export interface DualsenseCommand extends Uint8Array {
    /** Packet type */
    [0]: 0x2;
    /** Command effect limited to these bits */
    [1]: CommandScopeA | 0xff;
    /** Command effect also limited to these bits */
    [2]: CommandScopeB | (0x1 | 0x2 | 0x4 | 0x10 | 0x40);
    /** Right rumble intensity */
    [3]: Intensity;
    /** Left rumble intensity */
    [4]: Intensity;
    [5]: 0;
    [6]: 0;
    [7]: 0;
    [8]: 0;
    /** Microphone LED intensity */
    [9]: Intensity;
    /** Microphone mute state (0x10 muted, 0x00 unmuted) */
    [10]: 0x10 | 0x00;
    [11]: TriggerMode;
    [12]: number;
    [13]: number;
    [14]: number;
    [15]: number;
    [16]: number;
    [17]: number;
    [20]: number;
    [21]: 0;
    [22]: TriggerMode;
    [23]: number;
    [24]: number;
    [25]: number;
    [26]: number;
    [27]: number;
    [28]: number;
    [31]: number;
    [32]: 0;
    [33]: 0;
    [34]: 0;
    [35]: 0;
    [36]: 0;
    [37]: 0;
    [38]: 0;
    [39]: LedOptions;
    [40]: 0;
    [41]: 0;
    [42]: PulseOptions;
    [43]: Brightness;
    [44]: PlayerID;
    [45]: Intensity;
    [46]: Intensity;
    [47]: Intensity;
    [48]: never;
}
export {};
//# sourceMappingURL=command.d.ts.map