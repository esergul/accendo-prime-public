"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Momentary = void 0;
const input_1 = require("../input");
class Momentary extends input_1.Input {
    constructor() {
        super(...arguments);
        this.state = false;
    }
    get active() {
        return this.state;
    }
}
exports.Momentary = Momentary;
//# sourceMappingURL=momentary.js.map