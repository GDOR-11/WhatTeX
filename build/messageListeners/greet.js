"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const greetings = new Set(["opa", "oi", "bom dia", "eae", "iae", "eai", "hi", "hello", "hallo"]);
const greet = {
    blockMessagesFromMe: true,
    unseriousGroupsOnly: true,
    listener: (client, message) => {
        if (message.body === undefined)
            return;
        if (greetings.has(message.body.toLowerCase())) {
            client.sendText(message.chatId, message.body);
        }
    }
};
exports.default = greet;
