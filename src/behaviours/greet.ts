import wppconnect from "@wppconnect-team/wppconnect";
import Behaviour from "./behaviour";

const greetings = new Set(["opa", "oi", "bom dia", "eae", "iae", "hi", "hello", "hallo"]);

const greet: Behaviour = (client: wppconnect.Whatsapp) => {
    client.onMessage(message => {
        if(message.body === undefined) return;

        if(greetings.has(message.body.toLowerCase())) {
            client.sendText(message.chatId, message.body);
        }
    });
};

export default greet;
