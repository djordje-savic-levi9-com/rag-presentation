# AI Playground RAG Chatbot

Ovaj projekat je jednostavan RAG (Retrieval-Augmented Generation) chatbot sa podrškom za embedding i caching.

## Priprema

1. **Pokreni Ollama server** (neophodno za generisanje embeddinga):
   - Preuzmi i instaliraj Ollama: https://ollama.com/
   - Pokreni server: `ollama serve`

2. **Preuzmi potrebne modele za Ollama**

   Preporučeni modeli su već podešeni u kodu, ali ih moraš preuzeti lokalno:

   - **Za embedding:**
     ```sh
     ollama pull hf.co/CompendiumLabs/bge-base-en-v1.5-gguf
     ```
   - **Za chat (LLM):**
     ```sh
     ollama pull hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF
     ```
   
   Ako koristiš druge modele, izmeni ih u kodu (`embedding-db.ts` i `ollama.ts`).

3. **Instaliraj zavisnosti:**
   ```sh
   npm install
   ```

## Kako pokrenuti embedding (generisanje embeddinga za tekstualni fajl)

Za svaki tekstualni fajl (npr. `cat-facts.txt`) možeš pokrenuti embedding i upis u cache:

```sh
npm run embed -- cat-facts.txt
```

- Embeddingi se keširaju u fajlu `embedding-cache.json`.
- Skriptu možeš pokretati više puta, embedding se neće ponovo generisati za već obrađene tekstove.

## Kako pokrenuti chat

Chatbot koristi prethodno generisane embeddinge iz cache-a.

Pokreni chat sa:

```sh
npm start
```

- Chat koristi podatke iz `cat-facts.txt` (ili drugog fajla, ako izmeniš kod).
- Za izlaz iz chata, ukucaj `exit`.

## Napomene
- Za embedding i chat je neophodno da Ollama server radi u pozadini.
- Modeli za embedding i chat se mogu promeniti u kodu (`embedding-db.ts` i `ollama.ts`).
- Ako koristiš drugi fajl osim `cat-facts.txt`, pokreni embedding za taj fajl i izmeni kod u `ollama.ts` ako želiš da koristiš taj fajl u chatu.
