/// <reference types="node" />
import { HIDProvider, DualsenseHIDState } from "./hid_provider";
export declare class NodeHIDProvider extends HIDProvider {
    private device?;
    wireless: boolean;
    connect(): Promise<void>;
    write(data: Uint8Array): Promise<void>;
    get connected(): boolean;
    disconnect(): void;
    process(buffer: Buffer): DualsenseHIDState;
}
//# sourceMappingURL=node_hid_provider.d.ts.map