import 'dotenv/config';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Llama } from 'llama-node';
const MODEL_PATH = process.env.LLAMA_MODEL_PATH || './models/llama-2-7b-chat.bin';
const llama = new Llama({ modelPath: MODEL_PATH });
async function main() {
    while (true) {
        const userInput = readlineSync.question(chalk.cyan.bold('\nTi: '));
        if (userInput.trim().toLowerCase() === 'exit') {
            console.log('👋 Bye!');
            break;
        }
        try {
            const response = await llama.prompt(userInput);
            const aiMessage = response || '[Nema odgovora]';
            console.log(chalk.greenBright.bold('\nLlama:') + ' ' + chalk.green(aiMessage));
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error(chalk.redBright.bold('Greška pri pozivu Llama modela:'), chalk.red(errorMsg));
        }
    }
    console.log(chalk.gray('Kraj konverzacije.'));
}
void main();
