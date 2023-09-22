"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const greet = (client) => {
    client.onMessage(message => {
        if (message.body === undefined)
            return;
        if (message.body.toLowerCase().includes("esquizofrenia")) {
            client.sendText(message.chatId, "Bom dia, meu nome é esquizofrenia. Como posso lhe ajudar hoje?");
        }
    });
};
exports.default = greet;
