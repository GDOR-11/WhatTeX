"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bruh = {
    blockMessagesFromMe: true,
    unseriousGroupsOnly: true,
    listener: (client, message) => {
        if (message.body === undefined)
            return;
        if (!message.body.toLowerCase().includes("bruh"))
            return;
        for (let i = 0; i < 10; i++) {
            client.sendText(message.chatId, "bruh");
        }
    }
};
exports.default = bruh;
