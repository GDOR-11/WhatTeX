"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helloThere = {
    blockMessagesFromMe: true,
    unseriousGroupsOnly: true,
    listener: (client, message) => {
        if (message.body === undefined)
            return;
        if (message.body.toLowerCase() == "hello there") {
            client.sendText(message.chatId, "General Kenobi");
        }
    }
};
exports.default = helloThere;
