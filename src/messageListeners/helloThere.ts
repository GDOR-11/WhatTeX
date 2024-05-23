import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";

const helloThere: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if (message.body.toLowerCase() == "hello there") {
            client.sendText(message.chatId, "General Kenobi");
        }
    },
    helpMessage: "respondo automaticamente a \"hello there\""
};

export default helloThere;
