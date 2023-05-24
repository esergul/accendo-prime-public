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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIDProvider = exports.mapTrigger = exports.mapAxis = void 0;
__exportStar(require("../id"), exports);
/** Maps a HID input of 0...n to -1...1 */
function mapAxis(value, max = 255) {
    return (2 / max) * Math.max(0, Math.min(max, value)) - 1;
}
exports.mapAxis = mapAxis;
/** Maps a HID input of 0...255 to 0...1 */
function mapTrigger(value) {
    return (1 / 255) * Math.max(0, Math.min(255, value));
}
exports.mapTrigger = mapTrigger;
/** Supports a connection to a physical or virtual Dualsense device */
class HIDProvider {
    constructor() {
        /** Callback to use for new input events */
        this.onData = () => { };
        /** Callback to use for Error events */
        this.onError = () => { };
    }
    /** Treat the device as if it were connected over Bluetooth */
    setWireless() {
        this.wireless = true;
    }
    /** Treat the device as if it were connected over USB */
    setWired() {
        this.wireless = false;
    }
}
exports.HIDProvider = HIDProvider;
/** HID vendorId for a Dualsense controller */
HIDProvider.vendorId = 1356;
/** HID productId for a Dualsense controller */
HIDProvider.productId = 3302;
//# sourceMappingURL=hid_provider.js.map