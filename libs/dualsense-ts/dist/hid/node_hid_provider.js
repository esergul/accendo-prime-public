"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHIDProvider = void 0;
const hid_provider_1 = require("./hid_provider");
class NodeHIDProvider extends hid_provider_1.HIDProvider {
    constructor() {
        super(...arguments);
        this.wireless = false;
    }
    async connect() {
        return Promise.resolve().then(() => __importStar(require("node-hid"))).then(({ HID, devices }) => {
            this.disconnect();
            const controllers = devices(hid_provider_1.HIDProvider.vendorId, hid_provider_1.HIDProvider.productId);
            if (controllers.length === 0 || !controllers[0].path) {
                return this.onError(new Error(`No controllers (${devices().length} other devices)`));
            }
            if (controllers[0].interface === -1)
                this.wireless = true;
            const device = new HID(controllers[0].path);
            device.on("data", (arg) => {
                this.onData(this.process(arg));
            });
            device.on("error", (err) => {
                this.onError(err);
            });
            this.device = device;
        })
            .catch((err) => {
            this.onError(new Error(`Could not import 'node-hid'. Did you add it?\nError: ${err instanceof Error ? err.message : "???"}`));
        });
    }
    write(data) {
        if (!this.device)
            return Promise.resolve();
        this.device.write(Array.from(data));
        return Promise.resolve();
    }
    get connected() {
        return this.device !== undefined;
    }
    disconnect() {
        if (this.device) {
            this.device.removeAllListeners();
            this.device.close();
            this.device = undefined;
            this.wireless = false;
        }
    }
    process(buffer) {
        // Bluetooth buffer starts with an extra byte
        const report = buffer.subarray(this.wireless ? 2 : 1);
        const mainButtons = report.readUint8(7);
        const miscButtons = report.readUint8(8);
        const lastButtons = report.readUint8(9);
        const dpad = (mainButtons << 4) >> 4;
        return {
            ["LX" /* InputId.LeftAnalogX */]: (0, hid_provider_1.mapAxis)(report.readUint8(0)),
            ["LY" /* InputId.LeftAnalogY */]: -(0, hid_provider_1.mapAxis)(report.readUint8(1)),
            ["RX" /* InputId.RightAnalogX */]: (0, hid_provider_1.mapAxis)(report.readUint8(2)),
            ["RY" /* InputId.RightAnalogY */]: -(0, hid_provider_1.mapAxis)(report.readUint8(3)),
            ["L2" /* InputId.LeftTrigger */]: (0, hid_provider_1.mapTrigger)(report.readUint8(4)),
            ["R2" /* InputId.RightTrigger */]: (0, hid_provider_1.mapTrigger)(report.readUint8(5)),
            // 6 is a sequence byte
            ["Triangle" /* InputId.Triangle */]: (mainButtons & 128) > 0,
            ["Circle" /* InputId.Circle */]: (mainButtons & 64) > 0,
            ["Cross" /* InputId.Cross */]: (mainButtons & 32) > 0,
            ["Square" /* InputId.Square */]: (mainButtons & 16) > 0,
            ["Dpad" /* InputId.Dpad */]: dpad,
            ["Up" /* InputId.Up */]: dpad < 2 || dpad === 7,
            ["Down" /* InputId.Down */]: dpad > 2 && dpad < 6,
            ["Left" /* InputId.Left */]: dpad > 4 && dpad < 8,
            ["Right" /* InputId.Right */]: dpad > 0 && dpad < 4,
            ["L2Button" /* InputId.LeftTriggerButton */]: (miscButtons & 4) > 0,
            ["R2Button" /* InputId.RightTriggerButton */]: (miscButtons & 8) > 0,
            ["L1" /* InputId.LeftBumper */]: (miscButtons & 1) > 0,
            ["R1" /* InputId.RightBumper */]: (miscButtons & 2) > 0,
            ["Create" /* InputId.Create */]: (miscButtons & 16) > 0,
            ["Options" /* InputId.Options */]: (miscButtons & 32) > 0,
            ["L3" /* InputId.LeftAnalogButton */]: (miscButtons & 64) > 0,
            ["R3" /* InputId.RightAnalogButton */]: (miscButtons & 128) > 0,
            ["Playstation" /* InputId.Playstation */]: (lastButtons & 1) > 0,
            ["TouchButton" /* InputId.TouchButton */]: (lastButtons & 2) > 0,
            ["Mute" /* InputId.Mute */]: (lastButtons & 4) > 0,
            // The other 5 bits are unused
            // 5 reserved bytes
            ["GyroX" /* InputId.GyroX */]: report.readUint16LE(15),
            ["GyroY" /* InputId.GyroY */]: report.readUint16LE(17),
            ["GyroZ" /* InputId.GyroZ */]: report.readUint16LE(19),
            ["AccelX" /* InputId.AccelX */]: report.readUint16LE(21),
            ["AccelY" /* InputId.AccelY */]: report.readUint16LE(23),
            ["AccelZ" /* InputId.AccelZ */]: report.readUint16LE(25),
            // 4 bytes for sensor timestamp (32LE)
            // 1 reserved byte
            ["TouchId0" /* InputId.TouchId0 */]: report.readUint8(32) & 0x7f,
            ["TouchContact0" /* InputId.TouchContact0 */]: (report.readUint8(32) & 0x80) === 0,
            ["TouchX0" /* InputId.TouchX0 */]: (0, hid_provider_1.mapAxis)((report.readUint16LE(33) << 20) >> 20, 1920),
            ["TouchY0" /* InputId.TouchY0 */]: (0, hid_provider_1.mapAxis)(report.readUint16LE(34) >> 4, 1080),
            ["TouchId1" /* InputId.TouchId1 */]: report.readUint8(36) & 0x7f,
            ["TouchContact1" /* InputId.TouchContact1 */]: (report.readUint8(36) & 0x80) === 0,
            ["TouchX1" /* InputId.TouchX1 */]: (0, hid_provider_1.mapAxis)((report.readUint16LE(37) << 20) >> 20, 1920),
            ["TouchY1" /* InputId.TouchY1 */]: (0, hid_provider_1.mapAxis)(report.readUint16LE(38) >> 4, 1080),
            // 12 reserved bytes
            ["Status" /* InputId.Status */]: (report.readUint8(53) & 4) > 0,
        };
    }
}
exports.NodeHIDProvider = NodeHIDProvider;
//# sourceMappingURL=node_hid_provider.js.map