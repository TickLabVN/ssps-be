import { prisma } from '@repositories';
import { PrintingResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { PAID, PRINTING_STATUS } from '@constants';

const getAllPrintingRequest: Handler<PrintingResultDto, { Params: { userId: string } }> = async (req) => {
    const userId = req.userId;
    const printingRequests = await prisma.printingRequest.findMany({
        select: {
            status: true,
            location: true,
            number: true,
            fileName: true,
            pageNumber: true,
            coins: true,
            paid: true
        },
        where: {
            userId: {
                equals: userId
            }
        }
    });

    const formattedPrintingRequests = printingRequests.map((request) => {
        const status = request.status;
        const formatStatus = PRINTING_STATUS[status];

        const paid = request.paid;
        const formatPaid = PAID[paid];

        return {
            ...request,
            status: formatStatus,
            paid: formatPaid
        };
    });

    return formattedPrintingRequests;
};

export const printingRequestHandler = {
    getAllPrintingRequest
};
