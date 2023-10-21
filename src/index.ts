import * as wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./messageListeners/MessageListener";
import fs from "fs/promises";
import readline from "readline";

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
    require("./messageListeners/quemPerguntou").default,
    require("./messageListeners/bruh").default,
    require("./messageListeners/communism").default
];

let unseriousGroups: string[] = [];
fs.readFile("./unseriousGroups.txt", { encoding: "utf8" }).then(data => {
    unseriousGroups = data.split("\n");
}).catch(error => {
    console.error(error);
    process.exit(1);
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

        if(message.body === "!allowWhatTeX" && !unseriousGroups.includes(message.chatId)) {
            unseriousGroups.push(message.chatId);
            client.sendText(message.chatId, "WhatTeX has been activated. Use !disallowWhatTeX to deactivate.");
        }

        if(message.body === "!disallowWhatTeX") {
            let idx = unseriousGroups.indexOf(message.chatId);
            if(idx === -1) return;
            unseriousGroups.splice(idx, 1);
            client.sendText(message.chatId, "WhatTeX has been deactivated. Use !allowWhatTeX to reactivate.");
        }
    });

    const rl = readline.createInterface(process.stdin);
    rl.on("line", async line => {
        if(line.toLowerCase() === "q") {
            try {
                console.log("Writing data to unseriousGroups.txt...");
                await fs.writeFile("./unseriousGroups.txt", unseriousGroups.join("\n"));
            } catch(err) {
                console.error(`Could not save data:\n\n${err}\n`);
                console.error(`If the issue persists, exit with Control+C and manually write the following data to unseriousGroups.txt:\n${unseriousGroups.join("\n")}`);
            }
            await client.logout();
            process.exit(0);
        }
    });
}
