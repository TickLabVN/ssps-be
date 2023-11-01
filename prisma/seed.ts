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
            userName: 'student@example.com',
            password: '123456789',
            roles: ['student'],
            name: 'Student name',
            email: 'student@example.com'
        },
        {
            userName: 'ssps@example.com',
            password: '123456789',
            roles: ['admin'],
            name: 'Admin name',
            email: 'admin@example.com'
        },
        {
            userName: 'root@example.com',
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

const createLocation = async () => {
    const locations: { address: string }[] = [
        {
            address: 'H1'
        },
        {
            address: 'H2'
        },
        {
            address: 'H3'
        },
        {
            address: 'H6'
        }
    ];

    const sampleLocations = await prisma.location.createMany({
        data: locations
    });

    console.log(sampleLocations);
};

function getRandomElementFromArray<T>(arr: T[]): T | undefined {
    if (arr.length === 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

const createPrintingRequest = async () => {
    const studentUser = await prisma.user.findFirst({
        select: {
            id: true
        },
        where: {
            role: { has: USER_ROLES.student }
        }
    });

    const locations = await prisma.location.findMany({
        select: { id: true }
    });

    if (!studentUser) {
        console.error('No student user found with the specified role.');
        return;
    }

    const printingRequests: {
        status: $Enums.PrintingStatus;
        locationId: string | undefined;
        number: number;
        pageNumber: number;
        coins: number;
        paid: $Enums.Paid;
        userId: string;
    }[] = [
        {
            status: 'progressing',
            locationId: getRandomElementFromArray(locations)?.id,
            number: 2,
            pageNumber: 10,
            coins: 50,
            paid: 'paid',
            userId: studentUser.id
        },
        {
            status: 'ready',
            locationId: getRandomElementFromArray(locations)?.id,
            number: 2,
            pageNumber: 20,
            coins: 75,
            paid: 'paid',
            userId: studentUser.id
        },
        {
            status: 'done',
            locationId: getRandomElementFromArray(locations)?.id,
            number: 2,
            pageNumber: 5,
            coins: 30,
            paid: 'not_paid',
            userId: studentUser.id
        },
        {
            status: 'canceled',
            locationId: getRandomElementFromArray(locations)?.id,
            number: 2,
            pageNumber: 5,
            coins: 30,
            paid: 'not_paid',
            userId: studentUser.id
        },
        {
            status: 'done',
            locationId: getRandomElementFromArray(locations)?.id,
            number: 2,
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

const createConfiguration = async () => {
    const configuration: {
        name: string;
        value: string;
        description: string;
    }[] = [
        { name: 'coin per page', value: '2', description: 'The amount of coin a student need to print one page' },
        { name: 'dollar to coin', value: '73', description: 'The amount of coin user get per dollar' }
    ];

    const sampleConfiguration = await prisma.configuration.createMany({ data: configuration });

    console.log(sampleConfiguration);
};

async function generateSampleData() {
    await createUser();

    await createStudent();

    await createLocation();

    await createPrintingRequest();

    await createConfiguration();

    process.exit(0);
}

generateSampleData();
