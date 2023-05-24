"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Motion = void 0;
const gyroscope_1 = require("./gyroscope");
const accelerometer_1 = require("./accelerometer");
class Motion {
    constructor() {
        this.gyroscope = new gyroscope_1.Gyroscope();
        this.accelerometer = new accelerometer_1.Accelerometer();
    }
}
exports.Motion = Motion;
//# sourceMappingURL=motion.js.map