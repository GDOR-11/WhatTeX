import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener.js";

const greet: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if(message.body.toLowerCase().includes("esquizofrenia")) {
            client.sendText(message.chatId, "Bom dia, meu nome é esquizofrenia. Como posso lhe ajudar hoje?");
        }
    },
    helpMessage: "mencione meu nome informal (esquizofrenia) e eu me apresento"
};

export default greet;
