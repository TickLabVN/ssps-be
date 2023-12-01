import fs from 'fs/promises';
import path from 'path';
import { degrees, PDFDocument } from 'pdf-lib';
import { logger } from './logger';

const pageSide: (pdfByte: Buffer, option: 'one' | 'both') => Promise<Buffer> = async (pdfByte, option) => {
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
        logger.error('pageSide error');
        throw error;
    }
};

const keepPages: (pdfByte: Buffer, option: 'all' | 'odd' | 'even' | string[]) => Promise<Buffer> = async (pdfByte, option) => {
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
        console.error('keepPages error:', err.message);
        throw err;
    }
};

// export const oldConvertToPortraitOrLandscape: (pdfByte: Buffer, orientation: 'portrait' | 'landscape') => Promise<Buffer> = async (
//     pdfByte,
//     orientation
// ) => {
//     try {
//         const pdfDoc = await PDFDocument.load(pdfByte);
//         const newPdfDoc = await PDFDocument.create();

//         const pageCount = pdfDoc.getPageCount();

//         for (let i = 0; i < pageCount; i += orientation === 'landscape' ? 2 : 1) {
//             const newPage = newPdfDoc.addPage();

//             const firstPage = await newPdfDoc.embedPage(pdfDoc.getPage(i));
//             const secondPage = await newPdfDoc.embedPage(pdfDoc.getPage(i + 1));

//             const scaleRatio = newPage.getWidth() / newPage.getHeight();

//             const firstPageDims = firstPage.scale(scaleRatio);
//             const secondPageDims = secondPage.scale(scaleRatio);

//             newPage.drawPage(firstPage, {
//                 ...firstPageDims,
//                 x: (newPage.getWidth() - firstPageDims.height) / 2,
//                 y: newPage.getHeight() - (newPage.getHeight() / 2 - firstPageDims.width) / 2,
//                 rotate: degrees(-90)
//             });

//             newPage.drawPage(secondPage, {
//                 ...secondPageDims,
//                 x: (newPage.getWidth() - secondPageDims.height) / 2,
//                 y: (newPage.getHeight() / 2) * (2 - 1) - (newPage.getHeight() / 2 - secondPageDims.width) / 2,
//                 rotate: degrees(-90)
//             });
//         }

//         const uint8Array = await newPdfDoc.save();
//         const buffer = Buffer.from(uint8Array);

//         return buffer;
//     } catch (error) {
//         console.error('Conversion error:', error.message);
//         throw error;
//     }
// };

const convertToPortraitOrLandscape: (
    pdfByte: Buffer,
    orientation: 'portrait' | 'landscape',
    pagePerSheet: 1 | 2 | 4 | 6 | 9 | 16
) => Promise<Buffer> = async (pdfByte, orientation, pagePerSheet) => {
    try {
        const AMOUNT_ROW_OF_NEW_PAGE_CONVENTION: { [key in typeof pagePerSheet]: number } = {
            1: 1,
            2: 1,
            4: 2,
            6: 3,
            9: 3,
            16: 4
        };

        const pdfDoc = await PDFDocument.load(pdfByte);
        const pageCount = pdfDoc.getPageCount();

        const newPdfDoc = await PDFDocument.create();

        const amountRowOfNewPage = AMOUNT_ROW_OF_NEW_PAGE_CONVENTION[pagePerSheet];
        const amountColumnOfNewPage = pagePerSheet / amountRowOfNewPage;

        if (orientation === 'landscape' && pagePerSheet !== 1)
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
                            x: cellDims.y * rowNum + centerMove.x,
                            y: newPage.getHeight() - cellDims.x * colNum - centerMove.y,
                            rotate: degrees(-90)
                        });
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

const testFunction = async () => {
    try {
        const rootPath = process.cwd();
        const inputPath = path.join(rootPath, 'pdf/in/file.pdf');
        const outputPath = path.join(rootPath, 'pdf/out/file.pdf');

        const pdfBuffer = await fs.readFile(inputPath);

        const modifiedPdfBuffer = await convertToPortraitOrLandscape(pdfBuffer, 'landscape', 4);

        await fs.writeFile(outputPath, modifiedPdfBuffer);

        logger.info('PDF file successfully processed and saved.');
    } catch (error) {
        logger.error(error);
    }
};

testFunction();

export const editPdf = { pageSide, keepPages, testFunction, convertToPortraitOrLandscape };
