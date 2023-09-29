import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener";

const greet: MessageListener = {
    blockMessagesFromMe: true,
    unseriousGroupsOnly: true,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if(message.body === undefined) return;

        if(message.body.toLowerCase().includes("esquizofrenia")) {
            client.sendText(message.chatId, "Bom dia, meu nome é esquizofrenia. Como posso lhe ajudar hoje?");
        }
    }
};

export default greet;
