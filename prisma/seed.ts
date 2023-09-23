import { hashSync } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { USER_ROLES } from '../src/constants/auth';
import { UserRole } from 'src/types/auth';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const users: { userName: string; password: string; roles: (keyof typeof USER_ROLES)[] }[] = [
    {
        userName: 'student',
        password: '123456789',
        roles: ['student']
    },
    {
        userName: 'ssps@gmail.com',
        password: '123456789',
        roles: ['admin']
    },
    {
        userName: 'root',
        password: '123456789',
        roles: ['admin', 'student']
    }
];

async function generateSampleData() {
    const handledUsers = users.map((user) => {
        const hashPassword = hashSync(user.password, SALT_ROUNDS);
        const roleValue: UserRole[] = user.roles.map((role) => USER_ROLES[role]);
        return {
            userName: user.userName,
            password: hashPassword,
            role: roleValue
        };
    });

    const sampleUsers = await prisma.user.createMany({
        data: handledUsers
    });

    console.log(sampleUsers);
    process.exit(0);
}

generateSampleData();
