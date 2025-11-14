import { addCatFactsToDatabase } from './embedding-db';

async function main() {
    const fileName = process.argv[2];
    if (!fileName) {
        console.error('Usage: npm run embed -- <filename>');
        process.exit(1);
    }
    await addCatFactsToDatabase(fileName);
    console.log('Embedding finished.');
}

void main();

