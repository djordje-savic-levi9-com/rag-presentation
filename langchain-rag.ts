import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { RetrievalQAChain } from "langchain/chains";

const model = new OpenAI({ model: "gpt-4o-mini", temperature: 0 });
const embeddings = new OpenAIEmbeddings();

// 🧠 Naša mala baza znanja (koju LLM sam po sebi ne zna)
const docs = [
    new Document({ pageContent: "Project Falcon uses PostgreSQL for database and Redis for caching." }),
    new Document({ pageContent: "The internal API for Falcon is deployed on AWS Lambda." }),
];

// 🔹 1️⃣ Pretvori dokumente u embeddinge i napravi vector store
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// 🔹 2️⃣ Retriever dohvaća najrelevantnije dokumente
const retriever = vectorStore.asRetriever(2);

// 🔹 3️⃣ Kreiraj RAG lanac (spaja retrieval + generation)
const chain = RetrievalQAChain.fromLLM(model, retriever, {
    returnSourceDocuments: true,
});

// 🔹 4️⃣ Upit koji LLM sam po sebi ne bi znao
const query = "What database does Project Falcon use?";
const result = await chain.invoke({ query });

console.log("Q:", query);
console.log("A:", result.text);
console.log("Context used:", result.sourceDocuments.map(d => d.pageContent));
