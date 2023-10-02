import { hashSync } from 'bcrypt';
import { $Enums, PrismaClient, Student } from '@prisma/client';

const USER_ROLES = {
    admin: 5150,
    student: 2001,
    printer_manager: 3001,
    maintainer: 4001
};

type UserRole = keyof typeof USER_ROLES;

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const createUser = async () => {
    const users: { userName: string; password: string; roles: UserRole[]; name: string; email: string }[] = [
        {
            userName: 'student',
            password: '123456789',
            roles: ['student'],
            name: 'Student name',
            email: 'student@example.com'
        },
        {
            userName: 'ssps@gmail.com',
            password: '123456789',
            roles: ['admin'],
            name: 'Admin name',
            email: 'admin@example.com'
        },
        {
            userName: 'root',
            password: '123456789',
            roles: ['admin', 'student'],
            name: 'Root name',
            email: 'root@example.com'
        }
    ];

    const handledUsers = users.map((user) => {
        const { password, roles, ...remain } = user;
        const hashPassword = hashSync(password, SALT_ROUNDS);
        const roleValue: number[] = roles.map((role) => USER_ROLES[role]);
        return {
            ...remain,
            password: hashPassword,
            role: roleValue
        };
    });

    const sampleUsers = await prisma.user.createMany({
        data: handledUsers
    });

    console.log(sampleUsers);
};

const createStudent = async () => {
    // Fetch the user ID for a student with the specified role
    const studentUser = await prisma.user.findFirst({
        select: {
            id: true
        },
        where: {
            role: { has: USER_ROLES.student }
        }
    });

    // Check if a student user with the specified role exists
    if (!studentUser) {
        console.error('No student user found with the specified role.');
        return;
    }

    const students: Student[] = [
        {
            default_coin_per_sem: 100,
            remain_coin: 50,
            id: studentUser.id // Use the extracted user ID
        }
    ];

    const sampleStudents = await prisma.student.createMany({
        data: students
    });

    console.log(sampleStudents);
};

const createPrintingRequest = async () => {
    const studentUser = await prisma.user.findFirst({
        select: {
            id: true
        },
        where: {
            role: { has: USER_ROLES.student }
        }
    });

    // Check if a student user with the specified role exists
    if (!studentUser) {
        console.error('No student user found with the specified role.');
        return;
    }

    const printingRequests: {
        status: $Enums.PrintingStatus;
        location: string;
        number: number;
        fileName: string;
        pageNumber: number;
        coins: number;
        paid: $Enums.Paid;
        userId: string;
    }[] = [
        {
            status: 'progressing',
            location: 'Thu Duc, Ho Chi Minh, Viet Nam',
            number: 2,
            fileName: 'file1.pdf',
            pageNumber: 10,
            coins: 50,
            paid: 'paid',
            userId: studentUser.id
        },
        {
            status: 'ready',
            location: 'Tan Phu, Ho Chi Minh, Viet Nam',
            number: 2,
            fileName: 'file2.docx',
            pageNumber: 20,
            coins: 75,
            paid: 'paid',
            userId: studentUser.id
        },
        {
            status: 'done',
            location: 'Tan Phu, Ho Chi Minh, Viet Nam',
            number: 2,
            fileName: 'file3.txt',
            pageNumber: 5,
            coins: 30,
            paid: 'not_paid',
            userId: studentUser.id
        },
        {
            status: 'canceled',
            location: 'Tan Phu, Ho Chi Minh, Viet Nam',
            number: 2,
            fileName: 'file3.txt',
            pageNumber: 5,
            coins: 30,
            paid: 'not_paid',
            userId: studentUser.id
        },
        {
            status: 'done',
            location: 'Tan Phu, Ho Chi Minh, Viet Nam',
            number: 2,
            fileName: 'file3.txt',
            pageNumber: 5,
            coins: 30,
            paid: 'paid',
            userId: studentUser.id
        }
    ];

    const samplePrintingRequest = await prisma.printingRequest.createMany({
        data: printingRequests
    });

    console.log(samplePrintingRequest);
};

async function generateSampleData() {
    await createUser();

    await createStudent();

    await createPrintingRequest();

    process.exit(0);
}

generateSampleData();
