import 'dotenv/config';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import ollama from 'ollama';
import { addCatFactsToDatabase } from './embedding-db';
import { retrieve } from './retriever';

const LANGUAGE_MODEL = 'hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF';
export const EMBEDDING_MODEL = 'hf.co/CompendiumLabs/bge-base-en-v1.5-gguf';


// Chatbot
async function chatbot() {
  while (true) {
    const userInput = readlineSync.question(chalk.cyan.bold('\nTi: '));

    if (userInput.trim().toLowerCase() === 'exit') {
      console.log('👋 Bye!');
      break;
    }

    try {
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

        // Stream Ollama response
        const stream = await ollama.chat({
            model: LANGUAGE_MODEL,
            messages: [
                { role: 'system', content: instructionPrompt },
                { role: 'user', content: userInput }
            ],
            stream: true,
        });

        console.log(chalk.greenBright.bold('\nChatbot response:'));
        for await (const chunk of stream) {
            process.stdout.write(chunk.message.content);
        }
        console.log();
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(chalk.redBright.bold('Error calling Ollama API:'), chalk.red(errorMsg));
    }
  }
  console.log(chalk.gray('Kraj konverzacije.'));
}


async function main() {
    await addCatFactsToDatabase('cat-facts.txt');
    await chatbot();
}

void main();
