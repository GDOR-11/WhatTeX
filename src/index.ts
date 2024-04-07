import * as wppconnect from "@wppconnect-team/wppconnect";
import { beforeExitAsync } from "./beforeExit.js";
import fs from "fs/promises";


let unseriousGroups =
    (await fs.readFile("./unseriousGroups.txt", { encoding: "utf8" }))
    .split("\n").filter(str => str.match(/^\d+@[cg]\.us$/) !== null); 

setInterval(() => fs.writeFile("./unseriousGroups.txt", unseriousGroups.join("\n")), 600000);

let messageListeners = [
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
    (await import("./messageListeners/getChatId.js")).default,
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

    client.onAnyMessage(async message => {
        if(message.type !== wppconnect.MessageType.CHAT || !message.sender.isMe) return;

        let permissionMatch = message.body.match(/^!(dis)?allowWhatTeX([ \n]\d+@[cg]\.us)?/);
        if(permissionMatch === null) return;

        let id = permissionMatch[2]?.slice(1) || message.chatId;

        // !allowWhatTeX
        if(permissionMatch?.[1] === undefined) {
            if(unseriousGroups.includes(id)) {
                await client.sendText(message.chatId, "WhatTeX is already alllowed");
            } else {
                unseriousGroups.push(id);
                await client.sendText(message.chatId, "WhatTeX has been allowed, use !disallowWhatTeX to disallow");
            }
        }

        // !disallowWhatTeX
        if(permissionMatch?.[1] === "dis") {
            let idx = unseriousGroups.indexOf(id);
            if(idx === -1) {
                await client.sendText(message.chatId, "WhatTeX is already disalllowed");
            } else {
                unseriousGroups.splice(idx);
                await client.sendText(message.chatId, "WhatTeX has been disallowed, use !allowWhatTeX to allow back again");
            }
        }
    });

    client.onAnyMessage(async message => {
        if(message.type !== wppconnect.MessageType.CHAT || !message.sender.isMe) return;
        if(message.body === "!getUnseriousGroups") {
            let response = "";
            for(let chatId of unseriousGroups) {
                let chat = await client.getChatById(chatId);
                response += `${chat.contact.formattedName} (${chatId})\n`;
            }
            await client.sendText(message.chatId, response.slice(0, -1));
        }
    });

    client.onAnyMessage(async message => {
        if(message.type !== wppconnect.MessageType.CHAT) return;

        if(message.body === "!ajuda" || message.body === "!help") {
            let helpMessage = "Sou WhatTeX, o bot pessoal de Gabriel Ramalho. As minhas atuais funcionalidades são:";
            for(let messageListener of messageListeners) {
                helpMessage += `\n- ${messageListener.helpMessage}`;
            }
            await client.sendText(message.chatId, helpMessage);
        }
    });

    beforeExitAsync(async _signal => {
        console.log("saving data to unseriousGroups.txt...");
        await fs.writeFile("./unseriousGroups.txt", unseriousGroups.join("\n"));
        console.log("Logging out...");
        await client.logout();
    });
}
