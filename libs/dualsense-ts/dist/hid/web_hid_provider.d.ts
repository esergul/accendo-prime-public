/// <reference types="w3c-web-hid" />
import { HIDProvider, DualsenseHIDState } from "./hid_provider";
export declare class WebHIDProvider extends HIDProvider {
    private device?;
    wireless: boolean;
    constructor();
    attach(device: HIDDevice): void;
    /**
     * You need to get HID device permissions from an interactive
     * component, like a button. This returns a callback for triggering
     * the permissions request.
     */
    getRequest(): () => Promise<unknown>;
    connect(): void;
    get connected(): boolean;
    disconnect(): void;
    write(data: Uint8Array): Promise<void>;
    process(buffer: DataView): DualsenseHIDState;
}
//# sourceMappingURL=web_hid_provider.d.ts.map