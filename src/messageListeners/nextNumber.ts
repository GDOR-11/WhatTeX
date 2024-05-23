import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";

const bases = new Map([
    ["", 10],
    ["0b", 2],
    ["0o", 8],
    ["0x", 16]
]);

const nextNumber: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: (client, message) => {
        const prefix = message.body.toLowerCase().match(/^-?(0b|0b|0x|)/)?.[1];
        if (prefix === undefined) return;

        const base = bases.get(prefix);
        try {
            client.sendText(message.chatId, (BigInt(message.body) + 1n).toString(base));
        } catch (err) { }
    },
    helpMessage: "Me mande um número inteiro que eu mando o próximo"
};

export default nextNumber;
