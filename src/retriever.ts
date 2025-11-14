import fs from 'fs/promises';
import path from 'path';
import ollama from 'ollama';
import 'dotenv/config';

export type VectorEntry = [string, number[]];
const CACHE_PATH = path.join(process.cwd(), '/data/embedding-cache.json');

let VECTOR_DB: VectorEntry[] = [];

async function loadVectorDbFromCache(): Promise<void> {
    try {
        const data = await fs.readFile(CACHE_PATH, 'utf-8');
        const embeddingCache: Record<string, number[]> = JSON.parse(data);
        VECTOR_DB = Object.entries(embeddingCache) as VectorEntry[];
    } catch (e) {
        VECTOR_DB = [];
    }
}

// Cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, x, i) => sum + x * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0));
    const normB = Math.sqrt(b.reduce((sum, x) => sum + x * x, 0));
    return dotProduct / (normA * normB);
}

// Retrieve top N similar chunks from the vector database
export async function retrieve(query: string, topN = 3): Promise<[string, number][]> {
    await loadVectorDbFromCache();
    const model = process.env.EMBEDDING_MODEL;
    if (!model) throw new Error('Missing EMBEDDING_MODEL environment variable');
    const result = await ollama.embed({ model, input: query });
    const queryEmbedding = result.embeddings[0] as number[];
    const similarities = VECTOR_DB.map(([chunk, embedding]) => [
        chunk,
        cosineSimilarity(queryEmbedding, embedding),
    ] as [string, number]);
    similarities.sort((a, b) => b[1] - a[1]);
    return similarities.slice(0, topN);
}
