"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mute = void 0;
const momentary_1 = require("./momentary");
class Mute extends momentary_1.Momentary {
    constructor() {
        super(...arguments);
        this.indicator = {};
        this.status = new momentary_1.Momentary({ icon: "!", name: "Status" });
    }
}
exports.Mute = Mute;
//# sourceMappingURL=mute.js.map