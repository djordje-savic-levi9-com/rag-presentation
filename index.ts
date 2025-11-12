import 'dotenv/config';
import readlineSync from 'readline-sync';
import OpenAI from 'openai';
import chalk from 'chalk';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function main() {
  let previousResponseId: string | null = null;

  while (true) {
    const userInput = readlineSync.question(chalk.cyan.bold('\nTi: '));

      if (userInput.trim().toLowerCase() === 'exit') {
          console.log('👋 Bye!');
          break;
      }

    try {
      const response: any = await openai.responses.create({
        model: OPENAI_MODEL,
        input: userInput,
        ...(previousResponseId ? { previous_response_id: previousResponseId } : {}),
        store: true
      });

      const aiMessage = response.output_text || '[Nema odgovora]';
      console.log(chalk.greenBright.bold('\nOpenAI:') + ' ' + chalk.green(aiMessage));
      previousResponseId = response.id || null;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(chalk.redBright.bold('Greška pri pozivu OpenAI API-ja:'), chalk.red(errorMsg));
    }
  }
  console.log(chalk.gray('Kraj konverzacije.'));
}

void main();
