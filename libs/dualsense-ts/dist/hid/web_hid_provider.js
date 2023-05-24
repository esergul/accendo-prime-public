"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebHIDProvider = void 0;
const hid_provider_1 = require("./hid_provider");
class WebHIDProvider extends hid_provider_1.HIDProvider {
    constructor() {
        super();
        this.wireless = true; // TODO: Not sure what to check
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!navigator.hid)
            throw new Error("WebHID not supported by this browser");
        navigator.hid.addEventListener("disconnect", ({ device }) => {
            if (device === this.device)
                this.device = undefined;
        });
        navigator.hid.addEventListener("connect", ({ device }) => {
            if (!this.device)
                this.attach(device);
        });
    }
    attach(device) {
        device
            .open()
            .then(() => {
            this.device = device;
            this.device.addEventListener("inputreport", ({ data }) => {
                this.onData(this.process(data));
            });
        })
            .catch((err) => {
            this.onError(err);
        });
    }
    /**
     * You need to get HID device permissions from an interactive
     * component, like a button. This returns a callback for triggering
     * the permissions request.
     */
    getRequest() {
        return () => navigator.hid
            .requestDevice({
            filters: [
                {
                    vendorId: hid_provider_1.HIDProvider.vendorId,
                    productId: hid_provider_1.HIDProvider.productId,
                },
            ],
        })
            .then((devices) => {
            if (devices.length === 0) {
                return this.onError(new Error(`No controllers available`));
            }
            this.attach(devices[0]);
        })
            .catch((err) => {
            this.onError(err);
        });
    }
    connect() {
        // Nothing to be done.
    }
    get connected() {
        return this.device !== undefined;
    }
    disconnect() {
        if (this.device) {
            this.device.close().finally(() => {
                this.device = undefined;
                this.wireless = false;
            });
        }
    }
    async write(data) {
        if (!this.device)
            return;
        return this.device.sendFeatureReport(0, data);
    }
    process(buffer) {
        // Bluetooth buffer starts with an extra byte
        const report = new DataView(buffer.buffer, this.wireless ? 2 : 1);
        const mainButtons = report.getUint8(7);
        const miscButtons = report.getUint8(8);
        const lastButtons = report.getUint8(9);
        const dpad = (mainButtons << 4) >> 4;
        return {
            ["LX" /* InputId.LeftAnalogX */]: (0, hid_provider_1.mapAxis)(report.getUint8(0)),
            ["LY" /* InputId.LeftAnalogY */]: -(0, hid_provider_1.mapAxis)(report.getUint8(1)),
            ["RX" /* InputId.RightAnalogX */]: (0, hid_provider_1.mapAxis)(report.getUint8(2)),
            ["RY" /* InputId.RightAnalogY */]: -(0, hid_provider_1.mapAxis)(report.getUint8(3)),
            ["L2" /* InputId.LeftTrigger */]: (0, hid_provider_1.mapTrigger)(report.getUint8(4)),
            ["R2" /* InputId.RightTrigger */]: (0, hid_provider_1.mapTrigger)(report.getUint8(5)),
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
            ["GyroX" /* InputId.GyroX */]: report.getUint16(15, true),
            ["GyroY" /* InputId.GyroY */]: report.getUint16(17, true),
            ["GyroZ" /* InputId.GyroZ */]: report.getUint16(19, true),
            ["AccelX" /* InputId.AccelX */]: report.getUint16(21, true),
            ["AccelY" /* InputId.AccelY */]: report.getUint16(23, true),
            ["AccelZ" /* InputId.AccelZ */]: report.getUint16(25, true),
            ["TouchId0" /* InputId.TouchId0 */]: report.getUint8(32) & 0x7f,
            ["TouchContact0" /* InputId.TouchContact0 */]: (report.getUint8(32) & 0x80) === 0,
            ["TouchX0" /* InputId.TouchX0 */]: (0, hid_provider_1.mapAxis)((report.getUint16(33, true) << 20) >> 20, 1920),
            ["TouchY0" /* InputId.TouchY0 */]: (0, hid_provider_1.mapAxis)(report.getUint16(34, true) >> 4, 1080),
            ["TouchId1" /* InputId.TouchId1 */]: report.getUint8(36) & 0x7f,
            ["TouchContact1" /* InputId.TouchContact1 */]: (report.getUint8(36) & 0x80) === 0,
            ["TouchX1" /* InputId.TouchX1 */]: (0, hid_provider_1.mapAxis)((report.getUint16(37, true) << 20) >> 20, 1920),
            ["TouchY1" /* InputId.TouchY1 */]: (0, hid_provider_1.mapAxis)(report.getUint16(38, true) >> 4, 1080),
            ["Status" /* InputId.Status */]: (report.getUint8(53) & 4) > 0,
        };
    }
}
exports.WebHIDProvider = WebHIDProvider;
//# sourceMappingURL=web_hid_provider.js.map