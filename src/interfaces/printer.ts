export interface Printer {
    getSupportedPrintFormats(): string[];
    getPrinterDriverOptions(printerName: string): unknown;
    print(buffer: Buffer, fileType: string, printerName?: string): Promise<string>;
}
