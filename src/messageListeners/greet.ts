import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener";

const greetings = new Set(["opa", "oi", "bom dia", "eae", "iae", "eai", "hi", "hello", "hallo"]);


const greet: MessageListener = {
    blockMessagesFromMe: true,
    unseriousGroupsOnly: true,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if(message.body === undefined) return;

        if(greetings.has(message.body.toLowerCase())) {
            client.sendText(message.chatId, message.body);
        }
    }
};

export default greet;
