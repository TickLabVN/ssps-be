import { STUDENT_NOT_FOUND, USER_NOT_FOUND } from '@constants';
import { RemainCoinDto, UserDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';

const getUserById: Handler<UserDto> = async (req, res) => {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            userName: true
        },
        where: { id: userId }
    });
    if (user === null) return res.badRequest(USER_NOT_FOUND);
    return user;
};

const getCoin: Handler<RemainCoinDto> = async (req, res) => {
    const userId = req.userId;
    const student = await prisma.student.findUnique({
        select: {
            remain_coin: true
        },
        where: { id: userId }
    });
    if (!student) return res.badRequest(STUDENT_NOT_FOUND);
    return student.remain_coin;
};

export const usersHandler = {
    getUserById,
    getCoin
};
