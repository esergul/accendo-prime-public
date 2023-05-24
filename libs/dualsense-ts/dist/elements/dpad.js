"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dpad = void 0;
const momentary_1 = require("./momentary");
const input_1 = require("../input");
class Dpad extends input_1.Input {
    constructor(params = {}) {
        super(params);
        this.state = this;
        const { up, down, left, right } = params;
        this.up = new momentary_1.Momentary({ icon: "⮉", name: "Up", ...(up ?? {}) });
        this.down = new momentary_1.Momentary({ icon: "⮋", name: "Down", ...(down ?? {}) });
        this.left = new momentary_1.Momentary({ icon: "⮈", name: "Left", ...(left ?? {}) });
        this.right = new momentary_1.Momentary({ icon: "⮊", name: "Right", ...(right ?? {}) });
    }
    get active() {
        return (this.up.active ||
            this.down.active ||
            this.left.active ||
            this.right.active);
    }
}
exports.Dpad = Dpad;
//# sourceMappingURL=dpad.js.map