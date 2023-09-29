import * as wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./messageListeners/MessageListener";
import fs from "fs";

wppconnect.create({
    session: "WhatTeX",
    autoClose: 0
}).then(client => start(client)).catch(error => { throw error; });


let messageListeners: MessageListener[] = [
    require("./messageListeners/greet").default,
    require("./messageListeners/helloThere").default,
    require("./messageListeners/renderLaTeX").default,
    require("./messageListeners/anarchyChess").default,
    require("./messageListeners/presentMyself").default,
    require("./messageListeners/homenagemProfessores").default,
    require("./messageListeners/quemPerguntou").default
];

let unseriousGroups: string[] = [];
fs.readFile("./unseriousGroups.txt", { encoding: "utf8" }, (error, data) => {
    if(error) {
        console.error(error);
        process.exit(1);
    }
    unseriousGroups = data.split("\n");
});

function start(client: wppconnect.Whatsapp) {
    for(let messageListener of messageListeners) {
        client.onAnyMessage(message => {
            if(message.sender.isMe && messageListener.blockMessagesFromMe) {
                if(message.body === undefined) return;
                if(!message.body.startsWith("!test\n")) return;

                let msg = Object.assign({}, message);
                msg.body = message.body.slice(message.body.indexOf("\n") + 1);
                messageListener.listener(client, msg);
                return;
            }
            if(messageListener.unseriousGroupsOnly && !unseriousGroups.includes(message.chatId)) return;
            messageListener.listener(client, message);
        });
    }

    client.onAnyMessage(message => {
        if(message.body === undefined) return;
        if(!message.sender.isMe) return;

        if(message.body === "!setGroupAsUnserious" && !unseriousGroups.includes(message.chatId)) unseriousGroups.push(message.chatId);

        if(message.body === "!setGroupAsSerious") {
            let idx = unseriousGroups.indexOf(message.chatId);
            if(idx === -1) return;
            unseriousGroups.splice(idx, 1);
        }
    });

    process.on("exit", () => {
        console.log("writing data to unseriousGroups.txt...");
        fs.writeFileSync("./unseriousGroups.txt", unseriousGroups.join("\n"));
        console.log("successfully saved unserious groups to file!");
        process.exit(0);
    });
}
