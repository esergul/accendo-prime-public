"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicComparator = exports.ThresholdComparator = exports.VirtualComparator = void 0;
/** Input state change checker that always returns true */
function VirtualComparator() {
    return true;
}
exports.VirtualComparator = VirtualComparator;
/** Input state change checker that considers a numeric threshold */
function ThresholdComparator(threshold, deadzone, state, newState) {
    if (typeof state !== "number" || typeof newState !== "number")
        throw new Error("Bad threshold comparison");
    return (Math.abs(state - newState) > threshold &&
        (Math.abs(newState) > deadzone || Math.abs(state) > deadzone));
}
exports.ThresholdComparator = ThresholdComparator;
/** Input state change checker for most values */
function BasicComparator(state, newState) {
    return state !== newState;
}
exports.BasicComparator = BasicComparator;
//# sourceMappingURL=comparators.js.map