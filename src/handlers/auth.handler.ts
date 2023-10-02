import { compare, hash } from 'bcrypt';
import { prisma } from '@repositories';
import { cookieOptions, DUPLICATED_userName, LOGIN_FAIL, SALT_ROUNDS, USER_NOT_FOUND } from '@constants';
import jwt from 'jsonwebtoken';
import { envs } from '@configs';
import { User } from '@prisma/client';
import { AuthInputDto, SignUpRequestDto } from '@dtos/in';
import { AuthResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { logger } from '@utils';

const login: Handler<AuthResultDto, { Body: AuthInputDto }> = async (req, res) => {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            userName: true,
            password: true,
            role: true
        },
        where: { userName: req.body.userName }
    });
    if (!user) return res.badRequest(USER_NOT_FOUND);

    const correctPassword = await compare(req.body.password, user.password);
    if (!correctPassword) return res.badRequest(LOGIN_FAIL);

    const userToken = jwt.sign({ userId: user.id, roles: user.role }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id,
        userName: user.userName
    };
};

const signup: Handler<AuthResultDto, { Body: SignUpRequestDto }> = async (req, res) => {
    const hashPassword = await hash(req.body.password, SALT_ROUNDS);
    let user: User;
    try {
        user = await prisma.user.create({
            data: {
                userName: req.body.userName,
                password: hashPassword,
                name: req.body.name,
                role: req.body.role,
                email: req.body.email
            }
        });
    } catch (err) {
        logger.info(err);
        return res.badRequest(DUPLICATED_userName);
    }

    const userToken = jwt.sign({ userId: user.id }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id,
        userName: user.userName
    };
};

export const authHandler = {
    login,
    signup
};
