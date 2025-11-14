import 'dotenv/config';
import readlineSync from 'readline-sync';
import OpenAI from 'openai';
import chalk from 'chalk';
import ollama from 'ollama';
import fs from 'fs/promises';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';
const EMBEDDING_MODEL = 'hf.co/CompendiumLabs/bge-base-en-v1.5-gguf';


const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

type VectorEntry = [string, number[]];
const VECTOR_DB: VectorEntry[] = [];

async function addChunkToDatabase(chunk: string): Promise<void> {
    const result = await ollama.embed({ model: EMBEDDING_MODEL, input: chunk });
    const embedding = result.embeddings[0] as number[];
    VECTOR_DB.push([chunk, embedding]);
}

function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, x, i) => sum + x * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0));
    const normB = Math.sqrt(b.reduce((sum, x) => sum + x * x, 0));
    return dotProduct / (normA * normB);
}

async function addCatFactsToDatabase(filePath: string): Promise<void> {
    const data = await fs.readFile(filePath, 'utf-8');
    const facts = data.split('\n').map(line => line.trim()).filter(Boolean);
    for (let i = 0; i < facts.length; i++) {
        const fact = facts[i];
        await addChunkToDatabase(fact);
        console.log(`Added cat fact ${i + 1}/${facts.length} to the database`);
    }
}

await addCatFactsToDatabase('eurobasket-plain.txt');

async function retrieve(query: string, topN = 3): Promise<[string, number][]> {
    const result = await ollama.embed({ model: EMBEDDING_MODEL, input: query });
    const queryEmbedding = result.embeddings[0] as number[];
    const similarities = VECTOR_DB.map(([chunk, embedding]) => [
        chunk,
        cosineSimilarity(queryEmbedding, embedding),
    ] as [string, number]);
    similarities.sort((a, b) => b[1] - a[1]);
    return similarities.slice(0, topN);
}

async function main() {
    let previousResponseId: string | null = null;

    while (true) {
        const userInput = readlineSync.question(chalk.cyan.bold('\nTi: '));

        if (userInput.trim().toLowerCase() === 'exit') {
            console.log('👋 Bye!');
            break;
        }

        try {
            // Retrieval logic (if you want to keep context retrieval)
            const retrievedKnowledge = await retrieve(userInput, 3);
            console.log(chalk.yellow('\nRetrieved knowledge:'));
            retrievedKnowledge.forEach(([chunk, similarity]) =>
                console.log(` - (similarity: ${similarity.toFixed(2)}) ${chunk}`)
            );

            const instructionPrompt = `You are a helpful chatbot.
              Use only the following pieces of context to answer the question. Don't make up any new information:
              ${retrievedKnowledge.map(([chunk]) => ` - ${chunk}`).join('\n')}`;

            console.log(chalk.blueBright(instructionPrompt));
            console.log(chalk.magenta(userInput));

            // Use OpenAI for response
            const response: any = await openai.responses.create({
                model: OPENAI_MODEL,
                input: `${instructionPrompt}\n\nUser: ${userInput}`,
                ...(previousResponseId ? { previous_response_id: previousResponseId } : {}),
                store: true
            });

            const aiMessage = response.output_text || '[Nema odgovora]';
            console.log(chalk.greenBright.bold('\nOpenAI:') + ' ' + chalk.green(aiMessage));
            previousResponseId = response.id || null;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error(chalk.redBright.bold('Error calling OpenAI API:'), chalk.red(errorMsg));
        }
    }
    console.log(chalk.gray('Kraj konverzacije.'));
}

void main();
