import * as wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener";
import { sendImageFromLink } from "../utils";

const renderLaTeX: MessageListener = {
    blockMessagesFromMe: false,
    unseriousGroupsOnly: false,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if(message.body === undefined) return;

        if(!message.body.toLowerCase().startsWith("!renderlatex\n")) return;

        let sections = message.body.split("\n");
        sections.shift();
        let link: string;
        try {
            link = textToLatex(sections);
        } catch(err) {
            client.sendText(message.chatId, "Error while rendering LaTeX:\n\n" + err);
            return;
        }
        sendImageFromLink(client, message.chatId, link, undefined, undefined, message.quotedMsgId || undefined);

        if(message.sender.isMe) {
            client.deleteMessage(message.chatId, message.id, false); // delete globally
            client.deleteMessage(message.chatId, message.id, true); // delete locally
        }
    }
};

function textToLatex(text: string | string[]): string {
    let sections = typeof text === "string" ? text.split("\n") : text;

    let latex_code = "";
    for(let section of sections) {
        if(section.match(/\p{Diacritic}/u) !== null) throw Error("Cannot render accentuated characters");
        latex_code += "\\\\\\text{" + section + "}";
    }
    return "https://latex.codecogs.com/png.image?\\dpi{300}" + latex_code;
}

export default renderLaTeX;
