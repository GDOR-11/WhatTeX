"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloThere = void 0;
function HelloThere(client, message) {
    if (message.body === undefined)
        return;
    let destination = message.isGroupMsg ? message.chatId : message.from;
    if (message.body.toLowerCase() == "hello there") {
        client.sendText(destination, "General Kenobi");
    }
}
exports.HelloThere = HelloThere;
;
