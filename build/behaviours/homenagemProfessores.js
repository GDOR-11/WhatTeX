"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responses = {
    "rodrigao,rodrigão": "e aí gurizes",
    "quimicat, pat ,patricia,patrícia,quimicΔt,q=mcΔt,q=m.c.Δt": "rrrrrrrr",
    "chan": "reaçãooo globall",
    "cida": "axx cantigax de escárnio de Luix de Camões, né!?",
    "aline,baiana": "preguiçosos não entrarão no reino da ufisqui",
    "luisinho": "FAAAAAAAAALA RAÇA\nalias churras quando?",
    "pedro de filosofia": "SCHOPENHAUER",
    "joão": "como diz chucky... vocês já sabem o resto",
    "cláudia,claudia": "dicas QUENTÍSSIMAS pra prova de amanhã",
    "bioana": "quietos que só tenho uma aula por semana",
    "doris,dóris": "Pedrinho, Sie haben sehr schlechte Noten"
};
const homenagemProfessores = {
    type: "onMessage",
    allowSeriousGroups: false,
    func: (client, message) => {
        if (message.body === undefined)
            return;
        let lowerCase = message.body.toLowerCase();
        for (let key in responses) {
            for (let name of key.split(",")) {
                if (lowerCase.includes(name)) {
                    client.sendText(message.chatId, responses[key], { quotedMsg: message.id });
                }
            }
        }
    }
};
exports.default = homenagemProfessores;
