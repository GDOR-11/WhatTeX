"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const renderLaTeX = (client) => {
    client.onAnyMessage(message => {
        if (message.body === undefined)
            return;
        if (!message.body.toLowerCase().startsWith("!renderlatex\n"))
            return;
        let sections = message.body.split("\n");
        sections.shift();
        let link = textToLatex(sections);
        (0, utils_1.sendImageFromLink)(client, message.chatId, link);
        if (message.sender.isMe) {
            client.deleteMessage(message.chatId, message.id);
        }
    });
};
function textToLatex(text) {
    let sections = typeof text === "string" ? text.split("\n") : text;
    let latex_code = "";
    for (let section of sections) {
        if (section.startsWith("$") && section.endsWith("$")) {
            latex_code += "\\\\\\\\" + section.slice(1, -1);
        }
        else {
            latex_code += "\\\\\\\\\\text{" + section.replace("}", "\\}").replace("$", "\\$") + "}";
        }
    }
    return "https://latex.codecogs.com/png.image?\\dpi{300}" + latex_code;
}
exports.default = renderLaTeX;
