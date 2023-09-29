import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener";

const helloThere: MessageListener = {
    blockMessagesFromMe: true,
    unseriousGroupsOnly: true,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if(message.body === undefined) return;

        if(message.body.toLowerCase() == "hello there") {
            client.sendText(message.chatId, "General Kenobi");
        }
    }
};

export default helloThere;
