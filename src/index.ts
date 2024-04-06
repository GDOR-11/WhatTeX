import * as wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./messageListeners/MessageListener.js";
import { beforeExitAsync } from "./beforeExit.js";
import fs from "fs/promises";


let unseriousGroups: string[] =
    (await fs.readFile("./unseriousGroups.txt", { encoding: "utf8" }))
    .split("\n").filter(str => str.match(/^\d+@[cg].us$/) !== null); 

setInterval(fs.writeFile, 600000, "./unseriousGroups.txt", unseriousGroups.join("\n"));

let messageListeners: MessageListener[] = [
    (await import("./messageListeners/greet.js")).default,
    (await import("./messageListeners/helloThere.js")).default,
    (await import("./messageListeners/renderLaTeX.js")).default,
    (await import("./messageListeners/anarchyChess.js")).default,
    (await import("./messageListeners/presentMyself.js")).default,
    (await import("./messageListeners/homenagemProfessores.js")).default,
    (await import("./messageListeners/quemPerguntou.js")).default,
    (await import("./messageListeners/bruh.js")).default,
    (await import("./messageListeners/communism.js")).default,
    (await import("./messageListeners/chatGPT.js")).default,
    (await import("./messageListeners/nextLetter.js")).default,
    (await import("./messageListeners/repeat.js")).default,
    (await import("./messageListeners/shutdown.js")).default,
    (await import("./messageListeners/yesNo.js")).default,
    (await import("./messageListeners/nextNumber.js")).default,
];

wppconnect.defaultLogger.level = "info";
start(await wppconnect.create({
    session: "WhatTeX",
    autoClose: 0,
    browserArgs: ["--no-sandbox"],
    puppeteerOptions: {
        handleSIGINT: false,
    }
}));

function start(client: wppconnect.Whatsapp) {
    client.onAnyMessage(message => {
        // yes, optional chaining can be used to only call functions if they exist
        const match = message.body?.match?.(/^!test\n(.*)/s);
        if(match) message.body = match[1];
        const testing = Array.isArray(match) && message.sender.isMe;

        for(let messageListener of messageListeners) {
            if(message.type !== messageListener.type) return;

            let activateListener= messageListener.callerHasPermission(message.sender);
            if(messageListener.unseriousGroupsOnly) {
                activateListener &&= unseriousGroups.includes(message.chatId);
            }
            activateListener ||= testing;

            if(activateListener) messageListener.listener(client, message);
        }
    });

    client.onAnyMessage(message => {
        if(message.type !== wppconnect.MessageType.CHAT) return;

        if(message.sender.isMe && message.body.toLowerCase() === "!allowwhattex") {
            if(unseriousGroups.includes(message.chatId)) {
                return client.sendText(message.chatId, "WhatTeX is already activated.");
            }
            unseriousGroups.push(message.chatId);
            client.sendText(message.chatId, "WhatTeX has been activated. Use !disallowWhatTeX to deactivate.");
        }

        if(message.sender.isMe && message.body.toLowerCase() === "!disallowwhattex") {
            let idx = unseriousGroups.indexOf(message.chatId);
            if(idx === -1) {
                return client.sendText(message.chatId, "WhatTeX is already deactivated.");
            }
            unseriousGroups.splice(idx, 1);
            client.sendText(message.chatId, "WhatTeX has been deactivated. Use !allowWhatTeX to reactivate.");
        }

        if(message.body === "!ajuda" || message.body === "!help") {
            let helpMessage = "Sou WhatTeX (informalmente, esquizofrenia), o bot pessoal de Gabriel Ramalho. As minhas atuais funcionalidades são:";
            for(let messageListener of messageListeners) {
                helpMessage += `\n- ${messageListener.helpMessage}`;
            }
            client.sendText(message.chatId, helpMessage);
        }
    });

    beforeExitAsync(async _signal => {
        console.log("saving data to unseriousGroups.txt...");
        await fs.writeFile("./unseriousGroups.txt", unseriousGroups.join("\n"));
        console.log("Logging out...");
        await client.logout();
    });
}
