/** Input state change checker that always returns true */
export declare function VirtualComparator(): boolean;
/** Input state change checker that considers a numeric threshold */
export declare function ThresholdComparator(threshold: number, deadzone: number, state: unknown, newState: unknown): boolean;
/** Input state change checker for most values */
export declare function BasicComparator(state: unknown, newState: unknown): boolean;
//# sourceMappingURL=comparators.d.ts.map