"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const greetings = new Set(["opa", "oi", "bom dia", "eae", "iae", "hi", "hello", "hallo"]);
const greet = (client) => {
    client.onMessage(message => {
        if (message.body === undefined)
            return;
        if (greetings.has(message.body.toLowerCase())) {
            client.sendText(message.chatId, message.body);
        }
    });
};
exports.default = greet;
