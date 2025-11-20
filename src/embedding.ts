import ollama from 'ollama';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

// Embdeovanje i kesiranje

const CACHE_PATH = path.join(process.cwd(), '/data/embedding-cache.json');
let embeddingCache: Record<string, number[]> = {};

export async function loadEmbeddingCache() {
    try {
        const data = await fs.readFile(CACHE_PATH, 'utf-8');
        embeddingCache = JSON.parse(data);
    } catch (e) {
        embeddingCache = {};
    }
    return embeddingCache;
}

async function saveEmbeddingCache() {
    await fs.writeFile(CACHE_PATH, JSON.stringify(embeddingCache, null, 2), 'utf-8');
}

export async function addChunkToDatabase(chunk: string): Promise<void> {
    if (!embeddingCache[chunk]) {
        const model = process.env.EMBEDDING_MODEL;
        if(!model) throw new Error('EMBEDDING_MODEL environment variable is not set');
        const result = await ollama.embed({ model, input: chunk });
        embeddingCache[chunk] = result.embeddings[0] as number[];
        await saveEmbeddingCache();
    }
}

export async function addEmbeddingToDatabase(filePath: string): Promise<void> {
    await loadEmbeddingCache();
    const data = await fs.readFile(filePath, 'utf-8');
    const facts = data.split('\n').map(line => line.trim()).filter(Boolean);
    for (let i = 0; i < facts.length; i++) {
        const fact = facts[i];
        await addChunkToDatabase(fact);
        console.log(`Added fact ${i + 1}/${facts.length} to the database`);
    }
}
