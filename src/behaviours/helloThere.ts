import wppconnect from "@wppconnect-team/wppconnect";
import Behaviour from "./behaviour";

const helloThere: Behaviour = (client: wppconnect.Whatsapp) => {
    client.onMessage(message => {
        if(message.body === undefined) return;

        if(message.body.toLowerCase() == "hello there") {
            client.sendText(message.chatId, "General Kenobi");
        }
    });
};

export default helloThere;
