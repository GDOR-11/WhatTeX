"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const greet = (client) => {
    client.onMessage(message => {
        if (message.body === undefined)
            return;
        let lowerCase = message.body.toLowerCase();
        if (lowerCase.includes("rodrigão") || lowerCase.includes("rodrigao") || lowerCase.includes("professor de geo")) {
            client.sendText(message.chatId, "e aí gurizes", { quotedMsg: message.id });
        }
    });
};
exports.default = greet;
