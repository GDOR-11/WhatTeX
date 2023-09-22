import * as wppconnect from "@wppconnect-team/wppconnect";

wppconnect.create({
    session: "WhatTeX",
    autoClose: 0
}).then(client => start(client)).catch(error => { throw error; });

let behaviours = [
    require("./behaviours/helloThere").default,
    require("./behaviours/renderLaTeX").default,
    require("./behaviours/greet").default,
    require("./behaviours/presentMyself").default,
    require("./behaviours/anarchyChess").default,
    require("./behaviours/homenagemProfessores").default
];

function start(client: wppconnect.Whatsapp) {
    for(let behaviour of behaviours) behaviour(client);
}
