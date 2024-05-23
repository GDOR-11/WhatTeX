import fs from "fs/promises";
import * as utils from "./utils.js";
import MessageListener from "./MessageListener.js";
import wppconnect from "@wppconnect-team/wppconnect";
import { beforeExit } from "./beforeExit.js";

let unseriousGroups: utils.ChatId[] =
    (await fs.readFile("./unseriousGroups.txt", { encoding: "utf8" }))
        .split("\n").filter(str => str.match(/^\d+@[cg]\.us$/) !== null) as utils.ChatId[];

function saveUnseriousGroups() {
    fs.writeFile("./unseriousGroups.txt", unseriousGroups.join("\n"));
}

setInterval(saveUnseriousGroups, 600000);
beforeExit(saveUnseriousGroups);

export function getUnseriousGroups() { return unseriousGroups.slice(); }
export function isUnseriousGroup(group: utils.ChatId) { return unseriousGroups.includes(group); }

export function addUnseriousGroup(unseriousGroup: utils.ChatId) {
    if (!isUnseriousGroup(unseriousGroup)) {
        unseriousGroups.push(unseriousGroup);
        saveUnseriousGroups();
    }
}
export function removeUnseriousGroup(unseriousGroup: utils.ChatId) {
    let idx = unseriousGroups.indexOf(unseriousGroup);
    if (idx !== -1) {
        unseriousGroups.splice(idx, 1);
        saveUnseriousGroups();
    }
}

const unseriousGroupsListener: MessageListener = {
    unseriousGroupsOnly: false,
    callerHasPermission: caller => caller.isMe,
    type: wppconnect.MessageType.CHAT,
    listener: async (client, message) => {
        await (async () => {
            const permissionMatch = message.body.match(/^!(dis)?allowWhatTeX([ \n]\d+@[cg]\.us)?$/);
            if (permissionMatch === null) return;

            let id = (permissionMatch[2]?.slice(1) || message.chatId) as utils.ChatId;

            // !allowWhatTeX
            if (permissionMatch?.[1] === undefined) {
                addUnseriousGroup(id);
                await client.sendText(message.chatId, "WhatTeX is now allowed");
            }
            // !disallowWhatTeX
            if (permissionMatch?.[1] === "dis") {
                removeUnseriousGroup(id);
                await client.sendText(message.chatId, "WhatTeX is now disallowed");
            }
        })();

        if (message.body === "!getUnseriousGroups") {
            // <group name> (<group id>)
            await client.sendText(
                message.chatId,
                (await Promise.all(unseriousGroups.map(async chatId =>
                    `${(await client.getChatById(chatId)).contact.formattedName} (${chatId})`
                ))).join("\n")
            );
        };
    },
    helpMessage: "O dono do bot pode manejar uma lista de grupos apenas nos quais certos comportamentos sao permitidos"
};
export default unseriousGroupsListener;
