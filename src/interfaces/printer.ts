export interface Printer {
    print(buffer: Buffer): Promise<string>;
}
