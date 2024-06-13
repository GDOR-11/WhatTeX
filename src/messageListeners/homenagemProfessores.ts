import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";

const responses: { [key: string]: string } = {
    "rodrigao,rodrigão": "e aí gurizes",
    "quimicat,pat,patricia,patrícia,quimicΔt,q=mcΔt,q=m.c.Δt": "rrrrrrrr",
    "chan": "reaçãooo globall",
    "cida": "axx cantigax de escárnio de Luix de Camões, né!?",
    "aline,baiana": "preguiçosos não entrarão no reino da ufisqui",
    "luisinho,luizinho": "FAAAAAAAAALA RAÇA\nalias churras quando?",
    "pedro de filosofia": "SCHOPENHAUER",
    "joão,joao": "como diz chucky... vocês já sabem o resto",
    "cláudia,claudia": "dicas QUENTÍSSIMAS pra prova de amanhã",
    "bioana,bibi": "quietos que só tenho uma aula por semana",
    "doris,dóris": "Pedrinho, Sie haben sehr schlechte Noten"
};

const homenagemProfessores: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if (!message.body) return;
        let lowerCaseMessage = message.body.toLowerCase();

        for (let key in responses) {
            for (let name of key.split(",")) {
                if (lowerCaseMessage.includes(name)) {
                    client.sendText(message.chatId, responses[key], { quotedMsg: message.id });
                }
            }
        }
    },
    helpMessage: "mencione um professor eu eu honrarei sua memória (F aos professores demitidos em 2023)"
};

export default homenagemProfessores;
