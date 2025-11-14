import { pipeline } from "@xenova/transformers";
import { LLama } from "llama-node";
// 1️⃣ Dokumenti
const documents = [
    { id: 1, text: "Project Falcon uses PostgreSQL for its main database." },
    { id: 2, text: "Project Phoenix uses MongoDB for distributed storage." },
    { id: 3, text: "Project Eagle is deployed on AWS and uses S3." },
];
// 2️⃣ Kreiraj lokalni embedding pipeline
const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
// Encode dokumente
const docEmbeddings = await Promise.all(documents.map(async (d) => Array.from((await embedder(d.text))[0].dataSync())));
// 3️⃣ Kreiraj lokalni LLM
const llm = new LLama();
await llm.loadModel({ modelPath: "./models/llama-3-7b.gguf" });
// 4️⃣ Upit korisnika
const query = "Which project uses PostgreSQL?";
const queryEmbedding = Array.from((await embedder(query))[0].dataSync());
// 5️⃣ Retrieval
function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
}
function getTopDocs(queryEmb, docs, embeddings, topK = 2) {
    const scored = docs.map((d, i) => ({
        ...d,
        score: cosineSimilarity(queryEmb, embeddings[i])
    }));
    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}
const topDocs = getTopDocs(queryEmbedding, documents, docEmbeddings);
// 6️⃣ Augmentation (pravljenje prompta)
const context = topDocs.map(d => d.text).join("\n");
const prompt = `
You are a helpful assistant.
Use the following context to answer the user's question.

Context:
${context}

Question:
${query}

Answer:
`;
console.log("🧩 Prompt:\n", prompt);
// 7️⃣ Generation (lokalni LLM)
const answer = await llm.generate(prompt, { temperature: 0 });
console.log("\n💬 Model Answer:", answer);
console.log("Context used:", context);
