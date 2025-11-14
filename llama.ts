import 'dotenv/config';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { LLM } from 'llama-node';
import { LLamaCpp } from 'llama-node/dist/llm/llama-cpp.js';
import path from 'path';

const MODEL_PATH = process.env.LLAMA_MODEL_PATH || path.resolve('./models/llama-2-7b-chat.bin');
const llm = new LLM(LLamaCpp);
await llm.load({
  modelPath: MODEL_PATH,
  nCtx: 2048,
  nGpuLayers: 0,
  seed: 42,
  f16Kv: true,
  logitsAll: false,
  vocabOnly: false,
  useMlock: false,
  embedding: false,
  useMmap: true,
  enableLogging: false
});

async function main() {
  while (true) {
    const userInput = readlineSync.question(chalk.cyan.bold('\nTi: '));

    if (userInput.trim().toLowerCase() === 'exit') {
      console.log('👋 Bye!');
      break;
    }

    try {
      let answer = '';
      await llm.createCompletion(
        { prompt: userInput, nTokPredict: 512, temp: 0.7, nThreads: 4 },
        (data) => {
          if (data.token) answer += data.token;
        }
      );
      const aiMessage = answer.trim() || '[Nema odgovora]';
      console.log(chalk.greenBright.bold('\nLlama:') + ' ' + chalk.green(aiMessage));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(chalk.redBright.bold('Greška pri pozivu Llama modela:'), chalk.red(errorMsg));
    }
  }
  console.log(chalk.gray('Kraj konverzacije.'));
}

void main();
