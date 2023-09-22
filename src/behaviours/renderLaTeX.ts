import * as wppconnect from "@wppconnect-team/wppconnect";
import Behaviour from "./behaviour";
import { sendImageFromLink } from "../utils";

const renderLaTeX: Behaviour = (client: wppconnect.Whatsapp) => {
    client.onAnyMessage(message => {
        if(message.body === undefined) return;

        if(!message.body.toLowerCase().startsWith("!renderlatex\n")) return;

        let sections = message.body.split("\n");
        sections.shift();
        let link = textToLatex(sections);
        sendImageFromLink(client, message.chatId, link);

        if(message.sender.isMe) {
            client.deleteMessage(message.chatId, message.id);
        }
    });
}

function textToLatex(text: string | string[]): string {
    let sections = typeof text === "string" ? text.split("\n") : text;

    let latex_code = "";
    for(let section of sections) {
        if(section.startsWith("$") && section.endsWith("$")) {
            latex_code += "\\\\\\\\" + section.slice(1, -1);
        } else {
            latex_code += "\\\\\\\\\\text{" + section.replace("}", "\\}").replace("$", "\\$") + "}";
        }
    }
    return "https://latex.codecogs.com/png.image?\\dpi{300}" + latex_code;
}

export default renderLaTeX;
