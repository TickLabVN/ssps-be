import { hashSync } from 'bcrypt';
import { PrismaClient, Student } from '@prisma/client';

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
    const studentUser = await prisma.user.findMany({
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

    const students: Student[] = studentUser.map((user) => {
        return {
            default_coin_per_sem: 100,
            remain_coin: 5000,
            id: user.id
        };
    });

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

// function getRandomElementFromArray<T>(arr: T[]): T | undefined {
//     if (arr.length === 0) {
//         return undefined;
//     }

//     const randomIndex = Math.floor(Math.random() * arr.length);
//     return arr[randomIndex];
// }

// const createPrintingRequest = async () => {
//     const studentUser = await prisma.user.findFirst({
//         select: {
//             id: true
//         },
//         where: {
//             role: { has: USER_ROLES.student }
//         }
//     });

//     const locations = await prisma.location.findMany({
//         select: { id: true }
//     });

//     if (!studentUser) {
//         console.error('No student user found with the specified role.');
//         return;
//     }

//     const printingRequests: {
//         status: $Enums.PrintingStatus;
//         locationId: string | undefined;
//         numFiles: number;
//         numPages: number;
//         coins: number;
//         paid: $Enums.Paid;
//         userId: string;
//     }[] = [
//         {
//             status: 'progressing',
//             locationId: getRandomElementFromArray(locations)?.id,
//             numFiles: 0,
//             numPages: 0,
//             coins: 0,
//             paid: 'not_paid',
//             userId: studentUser.id
//         },
//         {
//             status: 'ready',
//             locationId: getRandomElementFromArray(locations)?.id,
//             numFiles: 0,
//             numPages: 0,
//             coins: 0,
//             paid: 'not_paid',
//             userId: studentUser.id
//         },
//         {
//             status: 'done',
//             locationId: getRandomElementFromArray(locations)?.id,
//             numFiles: 0,
//             numPages: 0,
//             coins: 0,
//             paid: 'not_paid',
//             userId: studentUser.id
//         },
//         {
//             status: 'canceled',
//             locationId: getRandomElementFromArray(locations)?.id,
//             numFiles: 0,
//             numPages: 0,
//             coins: 0,
//             paid: 'not_paid',
//             userId: studentUser.id
//         },
//         {
//             status: 'done',
//             locationId: getRandomElementFromArray(locations)?.id,
//             numFiles: 0,
//             numPages: 0,
//             coins: 0,
//             paid: 'not_paid',
//             userId: studentUser.id
//         }
//     ];

//     const samplePrintingRequest = await prisma.printingRequest.createMany({
//         data: printingRequests
//     });

//     console.log(samplePrintingRequest);
// };

const createConfiguration = async () => {
    const acceptedExtensions = ['pdf', 'png'];
    const configuration: {
        name: string;
        value: string;
        description: string;
    }[] = [
        { name: 'coin per page', value: '2', description: 'The amount of coin a student needs to print one page' },
        { name: 'dollar to coin', value: '73', description: 'The amount of coin user gets per dollar' },
        { name: 'coin per sem', value: '100', description: 'The amount of coin a student has free in one semester' },
        ///100mb = 100 * 1024 * 1024 (byte)
        { name: 'max file size', value: `${100 * 1024 * 1024}`, description: 'The amount of coin a student has free in one semester' },
        { name: 'service fee', value: `5`, description: 'The amount of coin for a printing request be executed' }
    ];

    const serializedExtensions = JSON.stringify(acceptedExtensions);

    configuration.push({ name: 'accepted extensions', value: serializedExtensions, description: 'Supported file extensions of printer' });

    const sampleConfiguration = await prisma.configuration.createMany({ data: configuration });

    console.log(sampleConfiguration);
};

async function generateSampleData() {
    await createUser();

    await createStudent();

    await createLocation();

    await createConfiguration();

    process.exit(0);
}

generateSampleData();
