"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responses = {
    "rodrigao,rodrigão": "e aí gurizes",
    "quimicat, pat ,patricia,patrícia,quimicΔt,q=mcΔt,q=m.c.Δt": "rrrrrrrr",
    "chan": "reaçãooo globall"
};
const homenagemProfessores = (client) => {
    client.onAnyMessage(message => {
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
    });
};
exports.default = homenagemProfessores;
