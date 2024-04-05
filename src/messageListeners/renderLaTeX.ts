import * as wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener.js";

const renderLaTeX: MessageListener = {
    unseriousGroupsOnly: false,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: _caller => true,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        let match = message.body.toLowerCase().match(/!render[lL]a[tT]e[xX]\n(.*)/s);
        if(match === null) return;

        let link = textToLatexLink(match[1]);
        client.sendImage(message.chatId, link, undefined, undefined, message.quotedMsgId || undefined);

        if(message.sender.isMe) {
            client.deleteMessage(message.chatId, message.id, false); // delete globally
        }
    },
    helpMessage: "comece uma mensagem com !renderlatex e uma quebra de linha que o resto será renderizado em LaTeX"
};

function textToLatexLink(text: string): string {
    let sections = text.split("\n");

    let latex_code = "";
    for(let section of sections) {
        latex_code += "\\\\\\text{" + section + "}";
    }
    return "https://latex.codecogs.com/png.image?\\dpi{300}" + latex_code;
}

export default renderLaTeX;
