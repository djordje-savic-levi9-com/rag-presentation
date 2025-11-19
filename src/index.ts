import 'dotenv/config';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { createChatClient } from './chat-client';
import { retrieve } from './retriever';

const chatClient = createChatClient();

async function chatbot() {
  while (true) {
    const userInput = readlineSync.question(chalk.cyan.bold('\nYou: '));

    if (userInput.trim().toLowerCase() === 'exit') {
      console.log('👋 Bye!');
      break;
    }

    try {
        let instructionPrompt = '';

        if (process.argv.includes('--no-rag')){
            const aiMessage = await chatClient.chat([{ role: 'user', content: userInput }]);
            console.log(chalk.greenBright.bold('\nAI:') + ' ' + chalk.green(aiMessage));
            continue;
        }

        const retrievedKnowledge = await retrieve(userInput, 3);
        console.log(chalk.yellow('\nRetrieved knowledge:'));
        retrievedKnowledge.forEach(([chunk, similarity]) =>
            console.log(` - (similarity: ${similarity.toFixed(2)}) ${chunk}`)
        );

        instructionPrompt = `
You are a helpful assistant. Answer questions based on the provided context.
CONTEXT:
${retrievedKnowledge.map(([chunk], index) => `${index + 1}. ${chunk}`).join('\n')}

INSTRUCTIONS:
- Use only the information from the context above
- If the context doesn't contain relevant information, say "I don't have enough information to answer that question"
- Be concise and accurate
- Reference the context when appropriate
`;
        // console.log(chalk.yellow('\nInstruction Prompt:'));
        // console.log(instructionPrompt);

        const aiMessage = await chatClient.chat([
            { role: 'system', content: instructionPrompt },
            { role: 'user', content: userInput },
        ]);
        console.log(chalk.greenBright.bold('\nAI:') + ' ' + chalk.green(aiMessage));
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(chalk.redBright.bold('Error calling chat client:'), chalk.red(errorMsg));
    }
  }
  console.log(chalk.gray('End of conversation.'));
}

void chatbot();
