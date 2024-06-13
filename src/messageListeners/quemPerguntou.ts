import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";

const quemPerguntou: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        let lowerCaseMessage = message.body?.toLowerCase();
        if (lowerCaseMessage == "quem?" || lowerCaseMessage == "quem") {
            client.sendText(message.chatId, "pergunto", { quotedMsg: message.id });
        }
    },
    helpMessage: "fale \"quem?\" e eu serei o primeiro a responder \"pergunto\""
};

export default quemPerguntou;
