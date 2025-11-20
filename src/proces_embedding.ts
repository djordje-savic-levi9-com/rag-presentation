import {addEmbeddingToDatabase} from './embedding';

async function main() {
    const fileName = process.argv[2];
    if (!fileName) {
        console.error('Usage: npm run embed -- <filename>');
        process.exit(1);
    }
    await addEmbeddingToDatabase(fileName);
    console.log('Embedding finished.');
}

void main();
