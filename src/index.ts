import 'dotenv/config';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { createChatClient } from './chat-client';
import { retrieve } from './retriever';

const chatClient = createChatClient();

// Chatbot aplikacija
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

        let instructionPrompt = `You are a helpful chatbot.
        Use only the following pieces of context to answer the question. 
        Don't make up any new information:
        ${retrievedKnowledge.map(([chunk]) => ` - ${chunk}`).join('\n')}`;

        if (process.env.USE_RAG === "false"){
            instructionPrompt = `You are a helpful chatbot. Try to answer user question.".`;
        }

        console.log(chalk.blueBright(instructionPrompt));
        console.log(chalk.magenta(userInput));

        // Use generic chat client for response
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
  console.log(chalk.gray('Kraj konverzacije.'));
}

void chatbot();
