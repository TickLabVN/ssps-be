import { prisma } from '@repositories';
import { GetPrintingRequestResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { PAID, PRINTING_STATUS } from '@constants';

const getAllPrintingRequest: Handler<GetPrintingRequestResultDto, { Params: { userId: string } }> = async (req) => {
    const userId = req.userId;
    const printingRequests = await prisma.printingRequest.findMany({
        select: {
            id: true,
            status: true,
            location: { select: { address: true } },
            number: true,
            pageNumber: true,
            coins: true,
            paid: true,
            files: { select: { realName: true } }
        },
        where: {
            userId: {
                equals: userId
            }
        }
    });

    const formattedPrintingRequests = printingRequests.map((request) => {
        const { status, files, paid, location, ...remain } = request;
        const formatStatus = PRINTING_STATUS[status];

        const formatFiles = files.map((item) => item.realName);

        const formatPaid = PAID[paid];

        const formatLocation = location?.address || '';

        return {
            ...remain,
            status: formatStatus,
            paid: formatPaid,
            filesName: formatFiles,
            location: formatLocation
        };
    });

    return formattedPrintingRequests;
};

export const printingRequestHandler = {
    getAllPrintingRequest
};
