import ollama from 'ollama';
import fs from 'fs/promises';
import path from 'path';

// Embedding model constant
export const EMBEDDING_MODEL = 'hf.co/CompendiumLabs/bge-base-en-v1.5-gguf';

// Each element is a tuple: [chunk, embedding]
export type VectorEntry = [string, number[]];
export const VECTOR_DB: VectorEntry[] = [];

const CACHE_PATH = path.join(process.cwd(), 'embedding-cache.json');
let embeddingCache: Record<string, number[]> = {};

// Load cache from disk
async function loadEmbeddingCache() {
    try {
        const data = await fs.readFile(CACHE_PATH, 'utf-8');
        embeddingCache = JSON.parse(data);
    } catch (e) {
        embeddingCache = {};
    }
}

// Save cache to disk
async function saveEmbeddingCache() {
    await fs.writeFile(CACHE_PATH, JSON.stringify(embeddingCache, null, 2), 'utf-8');
}

// Embedding with cache
export async function addChunkToDatabase(chunk: string): Promise<void> {
    if (!embeddingCache[chunk]) {
        const result = await ollama.embed({ model: EMBEDDING_MODEL, input: chunk });
        const embedding = result.embeddings[0] as number[];
        embeddingCache[chunk] = embedding;
        await saveEmbeddingCache();
    }
    VECTOR_DB.push([chunk, embeddingCache[chunk]]);
}

// Read data from a file, split them into chunks, and add to the vector database
export async function addCatFactsToDatabase(filePath: string): Promise<void> {
    await loadEmbeddingCache();
    const data = await fs.readFile(filePath, 'utf-8');
    const facts = data.split('\n').map(line => line.trim()).filter(Boolean);
    for (let i = 0; i < facts.length; i++) {
        const fact = facts[i];
        await addChunkToDatabase(fact);
        console.log(`Added cat fact ${i + 1}/${facts.length} to the database`);
    }
}
