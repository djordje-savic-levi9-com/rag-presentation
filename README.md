# AI Playground RAG Chatbot

Ovaj projekat je jednostavan RAG (Retrieval-Augmented Generation) chatbot sa podrškom za embedding i caching.

## Priprema

1. **Kreiraj .env fajl** (ako već nisi):
   ```sh
   cp .env.example .env
   ```
   U fajlu `.env` možeš birati da li koristiš **OpenAI** ili **Ollama** modele podešavanjem promenljive `CHAT_CLIENT`.

   Primer konfiguracije za Ollama (lokalno sve):
   ```dotenv
   CHAT_CLIENT=ollama
   OLLAMA_LANGUAGE_MODEL=hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF
   EMBEDDING_MODEL=hf.co/CompendiumLabs/bge-base-en-v1.5-gguf
   # OPENAI promenljive mogu ostati prazne
   OPENAI_API_KEY=
   OPENAI_MODEL=
   ```

   Primer konfiguracije za OpenAI (chat preko OpenAI, embedding lokalno preko Ollama):
   ```dotenv
   CHAT_CLIENT=openai
   OPENAI_API_KEY=sk-...            # Tvoj OpenAI API ključ
   OPENAI_MODEL=gpt-4.1-nano        # Ili drugi Open AI model
   OLLAMA_LANGUAGE_MODEL=  # moze biti prazno kad je CHAT_CLIENT=openai
   EMBEDDING_MODEL=hf.co/CompendiumLabs/bge-base-en-v1.5-gguf        # Koristi se za lokalne embeddinge
   ```

   Objašnjenje promenljivih:
   - `CHAT_CLIENT` = `openai` ili `ollama` (bira chat servis)
   - `OPENAI_API_KEY` i `OPENAI_MODEL` potrebni samo kada koristiš `CHAT_CLIENT=openai`
   - `OLLAMA_LANGUAGE_MODEL` potreban kada koristiš `CHAT_CLIENT=ollama` (lokalni LLM za odgovor)
   - `EMBEDDING_MODEL` je uvek potreban (trenutno embedding ide preko Ollama `embed` API-ja). Ako želiš OpenAI embedding, potrebno je izmeniti kod (nije uključeno u trenutnu verziju).

2. **Pokreni Ollama server** (neophodno za generisanje embeddinga čak i ako koristiš OpenAI za chat):
   - Preuzmi i instaliraj Ollama: https://ollama.com/
   - Pokreni server: `ollama serve`

3. **Preuzmi potrebne modele za Ollama**

   Preporučeni modeli su već podešeni u kodu, ali ih moraš preuzeti lokalno:

   - **Za embedding:**
     ```sh
     ollama pull hf.co/CompendiumLabs/bge-base-en-v1.5-gguf
     ```
   - **Za chat (LLM):**
     ```sh
     ollama pull hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF
     ```
   
   Ako koristiš druge modele, izmeni ih u `.env` fajlu.

4. **Instaliraj dependecy-je:**
   ```sh
   npm install
   ```

## Kako pokrenuti embedding (generisanje embeddinga za tekstualni fajl)

Za svaki tekstualni fajl (npr. `cat-facts.txt`) možeš pokrenuti embedding i upis u cache:

```sh
npm run embed -- ./raw_data/cat-facts.txt
```

- Embeddingi se keširaju u fajlu `data/embedding-cache.json`.
- Skriptu možeš pokretati više puta, embedding se neće ponovo generisati za već obrađene tekstove.

## Kako pokrenuti chat

Chatbot koristi prethodno generisane embeddinge iz cache-a.

Pokreni chat sa:

```sh
npm start
```

- Za izlaz iz chata, ukucaj `exit`.

## Napomene
- Za embedding (uvek) i za chat (kada `CHAT_CLIENT=ollama`) neophodno je da Ollama server radi u pozadini.
- Ako koristiš `CHAT_CLIENT=openai`, moraš imati validan `OPENAI_API_KEY` i model u `OPENAI_MODEL`.
- Modeli za embedding i chat se mogu promeniti u `.env`.
- Ako koristiš drugi fajl osim `cat-facts.txt`, pokreni embedding za taj fajl.
- OpenAI embedding trenutno nije implementiran; sistem uvek koristi Ollama za vektore.
