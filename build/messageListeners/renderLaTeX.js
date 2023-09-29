"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const renderLaTeX = {
    blockMessagesFromMe: false,
    unseriousGroupsOnly: false,
    listener: (client, message) => {
        if (message.body === undefined)
            return;
        if (!message.body.toLowerCase().startsWith("!renderlatex\n"))
            return;
        let sections = message.body.split("\n");
        sections.shift();
        let link = textToLatex(sections);
        (0, utils_1.sendImageFromLink)(client, message.chatId, link, undefined, undefined, message.quotedMsgId || undefined);
        if (message.sender.isMe) {
            client.deleteMessage(message.chatId, message.id, false); // delete globally
            client.deleteMessage(message.chatId, message.id, true); // delete locally
        }
    }
};
function textToLatex(text) {
    let sections = typeof text === "string" ? text.split("\n") : text;
    let latex_code = "";
    for (let section of sections) {
        latex_code += "\\\\\\text{" + section + "}";
    }
    return "https://latex.codecogs.com/png.image?\\dpi{300}" + latex_code;
}
exports.default = renderLaTeX;
