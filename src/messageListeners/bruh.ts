import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener";

const bruh: MessageListener = {
    blockMessagesFromMe: true,
    unseriousGroupsOnly: true,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if(message.body === undefined) return;

        if(!message.body.toLowerCase().includes("bruh")) return;

        for(let i = 0; i < 10; i++) {
            client.sendText(message.chatId, "bruh");
        }
    }
};

export default bruh;
