"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quemPerguntou = {
    blockMessagesFromMe: true,
    unseriousGroupsOnly: true,
    listener: (client, message) => {
        if (message.body === undefined)
            return;
        let lowerCaseMessage = message.body.toLowerCase();
        if (lowerCaseMessage == "quem?" || lowerCaseMessage == "quem") {
            client.sendText(message.chatId, "pergunto", { quotedMsg: message.id });
        }
    }
};
exports.default = quemPerguntou;
