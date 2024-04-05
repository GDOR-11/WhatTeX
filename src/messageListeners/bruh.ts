import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener.js";

const bruh: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: (client, message) => {
        if(!message.body.toLowerCase().includes("bruh")) return;

        for(let i = 0; i < 10; i++) {
            client.sendText(message.chatId, "bruh");
        }
    },
    helpMessage: "Se você falar \"bruh\", eu repito 10 vezes (único jeito de falar bruh mais que o pedrinho)"
};

export default bruh;
