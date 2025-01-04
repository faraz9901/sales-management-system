import fs from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export async function createLog(stringToAppend) {
    try {
        const fileName = path.join(__dirname, '..', '..', 'public', 'log.txt')
        await fs.appendFile(fileName, stringToAppend + '\n');

    } catch (err) {
        console.error(`Error appending to file:`, err);
    }
} 