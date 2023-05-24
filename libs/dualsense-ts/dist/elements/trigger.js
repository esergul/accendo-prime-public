"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trigger = void 0;
const input_1 = require("../input");
const momentary_1 = require("./momentary");
class Trigger extends input_1.Input {
    constructor() {
        super(...arguments);
        this.state = 0;
        this.button = new momentary_1.Momentary();
    }
    get active() {
        return this.state > 0;
    }
    get pressure() {
        return this.state;
    }
    get magnitude() {
        return this.state;
    }
    changes(state) {
        return this.state !== state;
    }
}
exports.Trigger = Trigger;
//# sourceMappingURL=trigger.js.map