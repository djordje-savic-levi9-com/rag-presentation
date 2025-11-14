"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var readline_sync_1 = require("readline-sync");
var chalk_1 = require("chalk");
var ollama_1 = require("ollama");
var promises_1 = require("fs/promises");
// Implement the retrieval system
var EMBEDDING_MODEL = 'hf.co/CompendiumLabs/bge-base-en-v1.5-gguf';
var LANGUAGE_MODEL = 'hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF';
var VECTOR_DB = [];
// Embedding
function addChunkToDatabase(chunk) {
    return __awaiter(this, void 0, void 0, function () {
        var result, embedding;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ollama_1.default.embed({ model: EMBEDDING_MODEL, input: chunk })];
                case 1:
                    result = _a.sent();
                    embedding = result.embeddings[0];
                    VECTOR_DB.push([chunk, embedding]);
                    return [2 /*return*/];
            }
        });
    });
}
// Read data from a file, split them into chunks, and add to the vector database
function addCatFactsToDatabase(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var data, facts, i, fact;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.readFile(filePath, 'utf-8')];
                case 1:
                    data = _a.sent();
                    facts = data.split('\n').map(function (line) { return line.trim(); }).filter(Boolean);
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < facts.length)) return [3 /*break*/, 5];
                    fact = facts[i];
                    return [4 /*yield*/, addChunkToDatabase(fact)];
                case 3:
                    _a.sent();
                    console.log("Added cat fact ".concat(i + 1, "/").concat(facts.length, " to the database"));
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Cosine similarity between two vectorsß
function cosineSimilarity(a, b) {
    var dotProduct = a.reduce(function (sum, x, i) { return sum + x * b[i]; }, 0);
    var normA = Math.sqrt(a.reduce(function (sum, x) { return sum + x * x; }, 0));
    var normB = Math.sqrt(b.reduce(function (sum, x) { return sum + x * x; }, 0));
    return dotProduct / (normA * normB);
}
// Retrieve top N similar chunks from the vector database
function retrieve(query_1) {
    return __awaiter(this, arguments, void 0, function (query, topN) {
        var result, queryEmbedding, similarities;
        if (topN === void 0) { topN = 3; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ollama_1.default.embed({ model: EMBEDDING_MODEL, input: query })];
                case 1:
                    result = _a.sent();
                    queryEmbedding = result.embeddings[0];
                    similarities = VECTOR_DB.map(function (_a) {
                        var chunk = _a[0], embedding = _a[1];
                        return [
                            chunk,
                            cosineSimilarity(queryEmbedding, embedding),
                        ];
                    });
                    similarities.sort(function (a, b) { return b[1] - a[1]; });
                    return [2 /*return*/, similarities.slice(0, topN)];
            }
        });
    });
}
// Chatbot
function chatbot() {
    return __awaiter(this, void 0, void 0, function () {
        var userInput, retrievedKnowledge, instructionPrompt, stream, _a, stream_1, stream_1_1, chunk, e_1_1, err_1, errorMsg;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!true) return [3 /*break*/, 18];
                    userInput = readline_sync_1.default.question(chalk_1.default.cyan.bold('\nTi: '));
                    if (userInput.trim().toLowerCase() === 'exit') {
                        console.log('👋 Bye!');
                        return [3 /*break*/, 18];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 16, , 17]);
                    return [4 /*yield*/, retrieve(userInput, 3)];
                case 2:
                    retrievedKnowledge = _e.sent();
                    console.log(chalk_1.default.yellow('\nRetrieved knowledge:'));
                    retrievedKnowledge.forEach(function (_a) {
                        var chunk = _a[0], similarity = _a[1];
                        return console.log(" - (similarity: ".concat(similarity.toFixed(2), ") ").concat(chunk));
                    });
                    instructionPrompt = "You are a helpful chatbot.\n        Use only the following pieces of context to answer the question. Don't make up any new information:\n        ".concat(retrievedKnowledge.map(function (_a) {
                        var chunk = _a[0];
                        return " - ".concat(chunk);
                    }).join('\n'));
                    console.log(chalk_1.default.blueBright(instructionPrompt));
                    console.log(chalk_1.default.magenta(userInput));
                    return [4 /*yield*/, ollama_1.default.chat({
                            model: LANGUAGE_MODEL,
                            messages: [
                                //{ role: 'system', content: instructionPrompt },
                                { role: 'user', content: userInput }
                            ],
                            stream: true,
                        })];
                case 3:
                    stream = _e.sent();
                    console.log(chalk_1.default.greenBright.bold('\nChatbot response:'));
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 9, 10, 15]);
                    _a = true, stream_1 = (e_1 = void 0, __asyncValues(stream));
                    _e.label = 5;
                case 5: return [4 /*yield*/, stream_1.next()];
                case 6:
                    if (!(stream_1_1 = _e.sent(), _b = stream_1_1.done, !_b)) return [3 /*break*/, 8];
                    _d = stream_1_1.value;
                    _a = false;
                    chunk = _d;
                    process.stdout.write(chunk.message.content);
                    _e.label = 7;
                case 7:
                    _a = true;
                    return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 15];
                case 9:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 15];
                case 10:
                    _e.trys.push([10, , 13, 14]);
                    if (!(!_a && !_b && (_c = stream_1.return))) return [3 /*break*/, 12];
                    return [4 /*yield*/, _c.call(stream_1)];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 14: return [7 /*endfinally*/];
                case 15:
                    console.log();
                    return [3 /*break*/, 17];
                case 16:
                    err_1 = _e.sent();
                    errorMsg = err_1 instanceof Error ? err_1.message : String(err_1);
                    console.error(chalk_1.default.redBright.bold('Error calling Ollama API:'), chalk_1.default.red(errorMsg));
                    return [3 /*break*/, 17];
                case 17: return [3 /*break*/, 0];
                case 18:
                    console.log(chalk_1.default.gray('Kraj konverzacije.'));
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addCatFactsToDatabase('cat-facts.txt')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, chatbot()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
void main();
