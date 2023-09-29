import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener";

const quemPerguntou: MessageListener = {
    blockMessagesFromMe: true,
    unseriousGroupsOnly: true,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if(message.body === undefined) return;

        let lowerCaseMessage = message.body.toLowerCase();
        if(lowerCaseMessage == "quem?" || lowerCaseMessage == "quem") {
            client.sendText(message.chatId, "pergunto", { quotedMsg: message.id });
        }
    }
};

export default quemPerguntou;
