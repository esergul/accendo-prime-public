"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Increment = void 0;
const input_1 = require("../input");
/** Container for counters associated with other inputs */
class Increment extends input_1.Input {
    constructor() {
        super(...arguments);
        this.state = 0;
        this.active = false;
    }
}
exports.Increment = Increment;
//# sourceMappingURL=increment.js.map