import * as wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";
import * as utils from "../utils.js";
import fs from "fs/promises";

const renderLaTeX: MessageListener = {
    unseriousGroupsOnly: false,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: _caller => true,
    listener: async (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        let match = message.body?.match(/^!render[lL]a[tT]e[xX](?: ([^\n]*))?\n(.*)/s);
        if (!match) return;

        const caption: string | undefined = match[1];
        const latex: string = match[2];

        const link = textToLatexLink(latex);

        const filepath = await utils.generateUnusedFilename("png");
        await utils.downloadFileFromLink(filepath, link);

        await client.sendImage(message.chatId, filepath, undefined, caption, message.quotedMsgId ?? undefined);
        if (message.sender.isMe) await client.deleteMessage(message.chatId, message.id, false);

        await fs.unlink(filepath);
    },
    helpMessage: "comece uma mensagem com !renderlatex e uma quebra de linha que o resto será renderizado em LaTeX"
};

function textToLatexLink(text: string): string {
    let sections = text.split("\n");

    let latex_code = "";
    for (let section of sections) {
        latex_code += "\\\\\\text{" + section + "}";
    }
    return "https://latex.codecogs.com/png.image?\\dpi{300}" + latex_code;
}

export default renderLaTeX;
