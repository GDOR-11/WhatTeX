import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener.js";

const greetings = new Set(["opa", "oi", "bom dia", "eae", "iae", "eai", "hi", "hey", "hello", "hallo"]);

const greet: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if(greetings.has(message.body.toLowerCase())) {
            client.sendText(message.chatId, message.body);
        }
    },
    helpMessage: "respondo automaticamente a um \"oi\" (ou similares)"
};

export default greet;
