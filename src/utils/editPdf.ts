import { degrees, PDFDocument } from 'pdf-lib';

export type PageSide = 'one' | 'both';
export type EdgeBinding = 'long' | 'short';
export type PageSideEdge = 'one' | EdgeBinding;
export type KeepPages = 'all' | 'odd' | 'even' | string[];
export type Orientation = 'portrait' | 'landscape';
export type PagePerSheet = 1 | 2 | 4 | 6 | 9 | 16;

const setPageSide: (pdfByte: Buffer, option: PageSide) => Promise<Buffer> = async (pdfByte, option) => {
    try {
        const pdfDoc = await PDFDocument.load(pdfByte);

        if (option === 'one') {
            const pageCount = pdfDoc.getPageCount();

            for (let i = 0; i < pageCount * 2; i = i + 2) {
                pdfDoc.insertPage(i + 1);
            }
        }

        const uint8Array = await pdfDoc.save();
        const buffer = Buffer.from(uint8Array);

        return buffer;
    } catch (error) {
        throw error;
    }
};

const setKeepPages: (pdfByte: Buffer, option: KeepPages) => Promise<Buffer> = async (pdfByte, option) => {
    try {
        if (option === 'all') return pdfByte;

        const pdfDoc = await PDFDocument.load(pdfByte);

        const pageCount = pdfDoc.getPageCount();
        const keepingPageNumbers = new Set<number>();

        if (option === 'odd' || option === 'even') {
            const start = option === 'odd' ? 1 : 0;
            for (let i = start; i < pageCount; i += 2) {
                keepingPageNumbers.add(i);
            }
        } else if (Array.isArray(option)) {
            for (const pageOption of option) {
                const isValid = /^(\d+)-(\d+)$/.test(pageOption) || /^\d+$/.test(pageOption);
                if (!isValid) throw new Error(`Invalid page option: ${pageOption}`);

                const [start, end] = pageOption.split('-').map(Number);
                if (start > end || start < 1 || end > pageCount) throw new Error(`Invalid range or page option: ${pageOption}`);

                for (let i = start; i <= (end || start); i++) {
                    keepingPageNumbers.add(i - 1);
                }
            }
        } else {
            throw new Error('Invalid option provided');
        }

        for (let i = pageCount - 1; i >= 0; i--) {
            if (!keepingPageNumbers.has(i)) {
                pdfDoc.removePage(i);
            }
        }

        const uint8Array = await pdfDoc.save();
        const buffer = Buffer.from(uint8Array);

        return buffer;
    } catch (err) {
        throw err;
    }
};

const convertToPortraitOrLandscape: (pdfByte: Buffer, orientation: Orientation, pagePerSheet: PagePerSheet) => Promise<Buffer> = async (
    pdfByte,
    orientation,
    pagePerSheet
) => {
    try {
        if (orientation === 'portrait' && pagePerSheet === 1) return pdfByte;
        if (orientation === 'landscape' && pagePerSheet === 1) throw new Error("Can't create landscape pages with one page per sheet");
        const newPdfDoc = await PDFDocument.create();
        const pdfDoc = await PDFDocument.load(pdfByte);
        const pageCount = pdfDoc.getPageCount();

        if (orientation === 'portrait') {
            const AMOUNT_ROW_OF_NEW_PAGE_CONVENTION: { [key in typeof pagePerSheet]: number } = {
                1: 1,
                2: 2,
                4: 2,
                6: 3,
                9: 3,
                16: 4
            };

            const amountRowOfNewPage = AMOUNT_ROW_OF_NEW_PAGE_CONVENTION[pagePerSheet];
            const amountColumnOfNewPage = pagePerSheet / amountRowOfNewPage;
            for (let pageNum = 0; pageNum < pageCount; pageNum += pagePerSheet) {
                const newPage = newPdfDoc.addPage();

                const scaleRatio = 1 / amountRowOfNewPage;
                const cellDims: { x: number; y: number } = {
                    x: newPage.getWidth() / amountColumnOfNewPage,
                    y: newPage.getHeight() / amountRowOfNewPage
                };

                for (let rowNum = 0; rowNum < amountRowOfNewPage; rowNum++)
                    for (let colNum = 0; colNum < amountColumnOfNewPage; colNum++) {
                        const embedOrder = rowNum * amountColumnOfNewPage + colNum;
                        const embedPageNum = pageNum + embedOrder;
                        if (embedPageNum >= pageCount) break;

                        const embedPage = await newPdfDoc.embedPage(pdfDoc.getPage(embedPageNum));

                        const embedPageDims = embedPage.scale(scaleRatio);
                        const centerMove: { x: number; y: number } = {
                            x: (cellDims.x - embedPageDims.width) / 2,
                            y: (cellDims.y - embedPageDims.height) / 2
                        };

                        newPage.drawPage(embedPage, {
                            ...embedPageDims,
                            x: cellDims.x * colNum + centerMove.x,
                            y: newPage.getHeight() - cellDims.y * (rowNum + 1) - centerMove.y
                        });
                    }
            }
        }

        if (orientation === 'landscape') {
            const AMOUNT_ROW_OF_NEW_PAGE_CONVENTION: { [key in typeof pagePerSheet]: number } = {
                1: 1,
                2: 1,
                4: 2,
                6: 2,
                9: 3,
                16: 4
            };

            const amountRowOfNewPage = AMOUNT_ROW_OF_NEW_PAGE_CONVENTION[pagePerSheet];
            const amountColumnOfNewPage = pagePerSheet / amountRowOfNewPage;
            for (let pageNum = 0; pageNum < pageCount; pageNum += pagePerSheet) {
                const newPage = newPdfDoc.addPage();

                const scaleRatio = newPage.getWidth() / newPage.getHeight() / amountRowOfNewPage;
                const cellDims: { x: number; y: number } = {
                    x: newPage.getHeight() / amountColumnOfNewPage,
                    y: newPage.getWidth() / amountRowOfNewPage
                };

                for (let rowNum = 0; rowNum < amountRowOfNewPage; rowNum++)
                    for (let colNum = 0; colNum < amountColumnOfNewPage; colNum++) {
                        const embedOrder = rowNum * amountRowOfNewPage + colNum;
                        const embedPageNum = pageNum + embedOrder;
                        if (embedPageNum >= pageCount) break;

                        const embedPage = await newPdfDoc.embedPage(pdfDoc.getPage(embedPageNum));

                        const embedPageDims = embedPage.scale(scaleRatio);
                        const centerMove: { x: number; y: number } = {
                            x: (cellDims.y - embedPageDims.height) / 2,
                            y: (cellDims.x - embedPageDims.width) / 2
                        };

                        newPage.drawPage(embedPage, {
                            ...embedPageDims,
                            x: cellDims.y * (amountRowOfNewPage - rowNum - 1) + centerMove.x,
                            y: newPage.getHeight() - cellDims.x * colNum - centerMove.y,
                            rotate: degrees(-90)
                        });
                    }
            }
        }

        const uint8Array = await newPdfDoc.save();
        const buffer = Buffer.from(uint8Array);

        return buffer;
    } catch (error) {
        console.error('Conversion error:', error.message);
        throw error;
    }
};

const setTwoSideShortLongEdge: (pdfByte: Buffer, orientation: Orientation, edgeBinding?: EdgeBinding) => Promise<Buffer> = async (
    pdfByte,
    orientation,
    edgeBinding
) => {
    try {
        if (!edgeBinding) return pdfByte;
        if (orientation === 'portrait' && edgeBinding === 'long') return pdfByte;
        if (orientation === 'landscape' && edgeBinding === 'short') return pdfByte;
        const newPdfDoc = await PDFDocument.create();
        const pdfDoc = await PDFDocument.load(pdfByte);
        const pageCount = pdfDoc.getPageCount();

        for (let pageNum = 0; pageNum < pageCount; pageNum++) {
            const newPage = newPdfDoc.addPage();

            const embedPage = await newPdfDoc.embedPage(pdfDoc.getPage(pageNum));

            const adjustCoefficient = pageNum % 2 ? 1 : 0;

            newPage.drawPage(embedPage, {
                rotate: degrees(180 * adjustCoefficient),
                x: embedPage.width * adjustCoefficient,
                y: embedPage.height * adjustCoefficient
            });
        }

        const uint8Array = await newPdfDoc.save();
        const buffer = Buffer.from(uint8Array);

        return buffer;
    } catch (error) {
        console.error('Conversion error:', error.message);
        throw error;
    }
};

/**
 *
 * @param pdfByte A buffer of the PDF file.
 * Note that this file must have configuration is pageSideEdge='long' keepPages = 'all', orientation = 'portrait',  pagePerSheet = 1.
 * @param pageSideEdge 'one' | 'long' | 'short'
 * @param keepPages 'all' | 'odd' | 'even' | string[]
 * Example: ['1', '3-5', '9']
 * @param orientation 'portrait' | 'landscape'
 * @param pagePerSheet 1 | 2 | 4 | 6 | 9 | 16
 * @param edgeBinding 'long' | 'short'
 * @returns An edited pdf file
 * @example editPdfPrinting(pdfBuffer, 'long', ['9', '3-5', '1'], 'landscape', 6);
 */
const editPdfPrinting = async (
    pdfByte: Buffer,
    pageSideEdge: PageSideEdge,
    keepPages: KeepPages,
    orientation: Orientation,
    pagePerSheet: PagePerSheet
): Promise<Buffer> => {
    const withKeepPages = await setKeepPages(pdfByte, keepPages);
    const withOrientation = await convertToPortraitOrLandscape(withKeepPages, orientation, pagePerSheet);
    const withEdgeBinding =
        pageSideEdge === 'one' ? withOrientation : await setTwoSideShortLongEdge(withOrientation, orientation, pageSideEdge);
    const withPageSide = await setPageSide(withEdgeBinding, pageSideEdge === 'one' ? 'one' : 'both');

    return withPageSide;
};

export const editPdf = { setPageSide, setKeepPages, convertToPortraitOrLandscape, setTwoSideShortLongEdge, editPdfPrinting };
