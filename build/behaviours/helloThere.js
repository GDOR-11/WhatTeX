"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helloThere = {
    type: "onMessage",
    allowSeriousGroups: false,
    func: (client, message) => {
        if (message.body === undefined)
            return;
        if (message.body.toLowerCase() == "hello there") {
            client.sendText(message.chatId, "General Kenobi");
        }
    }
};
exports.default = helloThere;
