import wppconnect from "@wppconnect-team/wppconnect";
import Behaviour from "./behaviour";

const greet: Behaviour = (client: wppconnect.Whatsapp) => {
    client.onMessage(message => {
        if(message.body === undefined) return;

        if(message.body.toLowerCase().includes("esquizofrenia")) {
            client.sendText(message.chatId, "Bom dia, meu nome é esquizofrenia. Como posso lhe ajudar hoje?");
        }
    });
};

export default greet;
