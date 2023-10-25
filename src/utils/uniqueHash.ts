import { SALT_ROUNDS } from '@constants';
import bcrypt from 'bcrypt';

export function generateUniqueHashFileName(fileName: string) {
    const lastPeriodIndex = fileName.lastIndexOf('.');
    if (lastPeriodIndex === -1) {
        throw new Error('Invalid filename');
    }

    const fileExtension = fileName.slice(lastPeriodIndex);
    const baseFileName = fileName.slice(0, lastPeriodIndex);

    const timestamp = new Date().getTime().toString();
    const combinedString = `${baseFileName}${timestamp}`;
    const hash = bcrypt.hashSync(combinedString, SALT_ROUNDS);

    const uniqueFileName = `${hash}${fileExtension}`;

    return uniqueFileName;
}
