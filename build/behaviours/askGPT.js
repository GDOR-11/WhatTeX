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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const askGPT = (client) => {
    const openai = new openai_1.default({ apiKey: "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" });
    client.onAnyMessage((message) => __awaiter(void 0, void 0, void 0, function* () {
        if (message.body === undefined)
            return;
        if (!message.body.startsWith("!askGPT\n"))
            return;
        let request = message.body.slice(message.body.indexOf("\n"));
        let response = (yield openai.chat.completions.create({
            messages: [{ role: "user", content: request }],
            model: "gpt-3.5-turbo"
        })).choices[0].message.content;
        client.sendText(message.chatId, response ? response : "ChatGPT não respondeu");
    }));
};
exports.default = askGPT;
