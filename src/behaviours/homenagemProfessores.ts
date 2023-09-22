import wppconnect from "@wppconnect-team/wppconnect";
import Behaviour from "./behaviour";

const responses: {[key: string]: string} = {
    "rodrigao,rodrigão": "e aí gurizes",
    "quimicat, pat ,patricia,patrícia,quimicΔt,q=mcΔt,q=m.c.Δt": "rrrrrrrr",
    "chan": "reaçãooo globall"
};

const homenagemProfessores: Behaviour = (client: wppconnect.Whatsapp) => {
    client.onAnyMessage(message => {
        if(message.body === undefined) return;

        let lowerCase = message.body.toLowerCase();

        for(let key in responses) {
            for(let name of key.split(",")) {
                if(lowerCase.includes(name)) {
                    client.sendText(message.chatId, responses[key], { quotedMsg: message.id });
                }
            }
        }
    });
};

export default homenagemProfessores;
