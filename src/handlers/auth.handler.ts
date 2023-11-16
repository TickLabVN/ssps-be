import { compare, hash } from 'bcrypt';
import { prisma } from '@repositories';
import { cookieOptions, DUPLICATED_userName, LOGIN_FAIL, SALT_ROUNDS, USER_NOT_FOUND, USER_ROLES } from '@constants';
import jwt from 'jsonwebtoken';
import { envs } from '@configs';
import { User } from '@prisma/client';
import { AuthInputDto, GoogleOAuthParamsDto, SignUpRequestDto } from '@dtos/in';
import { AuthResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { getUserInfo, logger } from '@utils';
import { UserRole } from 'src/types/auth';
import { DBConfiguration } from './getConfigurationInDb.handler';

const login: Handler<AuthResultDto, { Body: AuthInputDto }> = async (req, res) => {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            userName: true,
            password: true,
            role: true
        },
        where: { userName: req.body.email }
    });
    if (!user) return res.badRequest(USER_NOT_FOUND);

    if (!user.password) return res.badRequest('User is not valid!');
    const correctPassword = await compare(req.body.password, user.password);
    if (!correctPassword) return res.badRequest(LOGIN_FAIL);

    const userToken = jwt.sign({ userId: user.id, roles: user.role }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id
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
        id: user.id
    };
};

const createStudent = async (userData: { name: string; email: string; role: UserRole[] }) => {
    const coinPerSem = await DBConfiguration.coinPerSem;
    return prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
            data: userData,
            select: { id: true }
        });

        await prisma.student.create({
            data: { default_coin_per_sem: coinPerSem, remain_coin: coinPerSem, id: user.id }
        });

        return user;
    });
};

const googleOAuth: Handler<AuthResultDto, { Querystring: GoogleOAuthParamsDto }> = async (req, res) => {
    try {
        const { userEmail, userName, isVerifiedEmail } = await getUserInfo(req.query.code);

        if (!isVerifiedEmail) {
            return res.status(406).send('Email needs to be verified for authentication.');
        }

        if (userEmail && userName) {
            const user = await prisma.user.findUnique({
                where: { email: userEmail },
                select: { id: true }
            });

            const userData = {
                name: userName,
                email: userEmail,
                role: [USER_ROLES.student]
            };

            const userId = user ? user.id : (await createStudent(userData)).id;

            const userToken = jwt.sign({ userId: userId }, envs.JWT_SECRET);
            res.setCookie('token', userToken, cookieOptions);

            return res.redirect(envs.UI_HOME_URL).send({ id: userId });
        } else {
            res.status(400).send('User information not available.');
        }
    } catch (error) {
        console.error('Error processing user information:', error);
        res.status(500).send('Error processing user information');
    }
};

export const authHandler = {
    login,
    signup,
    googleOAuth
};
