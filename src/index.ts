import * as wppconnect from "@wppconnect-team/wppconnect";
import fs from "fs/promises";
import type { ChatId } from "./utils.js";
import { isUnseriousGroup } from "./unseriousGroups.js";
import { beforeExitAsync } from "./beforeExit.js";
import type MessageListener from "./MessageListener.js";
import { fileURLToPath } from "url";
import path from "path";

let messageListeners: MessageListener[] = [
    (await import("./unseriousGroups.js")).default
];

// easy way to import all files under a few directories
(async () => {
    // we don't want the code to have different behaviours depending on where you call it from
    let directories = ["./messageListeners"].map(dir => fileURLToPath(import.meta.resolve(dir)));

    for (let directory of directories) {
        // get all files in the directory and dinamically import them
        messageListeners = messageListeners.concat(await Promise.all(
            (await fs.readdir(directory)).map(async file =>
                (await import(path.resolve(directory, file))).default
            )
        ));
    }
})();

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
        // some logic to determine wether we should call or not the listener

        const match = message.body?.match?.(/^!test\n(.*)/s);
        if (Array.isArray(match)) message.body = match[1];
        const testing = Array.isArray(match) && message.sender.isMe;

        for (let messageListener of messageListeners) {
            if (message.type !== messageListener.type) return;

            let activateListener = messageListener.callerHasPermission(message.sender);
            if (messageListener.unseriousGroupsOnly) {
                activateListener &&= isUnseriousGroup(message.chatId as ChatId);
            }
            activateListener ||= testing;

            if (activateListener) messageListener.listener(client, message);
        }
    });

    client.onAnyMessage(async message => {
        if (message.type !== wppconnect.MessageType.CHAT) return;

        if (message.body === "!ajuda" || message.body === "!help") {
            let helpMessage = "Sou WhatTeX, o bot pessoal de Gabriel Ramalho. As minhas atuais funcionalidades são:";
            for (let messageListener of messageListeners) {
                helpMessage += `\n- ${messageListener.helpMessage}`;
            }
            await client.sendText(message.chatId, helpMessage);
        }
    });

    beforeExitAsync(async _signal => await client.logout());
}
