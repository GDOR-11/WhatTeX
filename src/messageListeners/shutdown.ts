import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";

const shutdown: MessageListener = {
    unseriousGroupsOnly: false,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => caller.isMe,
    listener: async (client, message) => {
        switch (message.body.toLowerCase()) {
            case "!shutdown":
                await client.sendText(message.chatId, "shutting down WhatTeX bot...");
            case "!quickshutdown":
                process.emit("SIGINT");
                break;
            case "!forceshutdown":
                process.exit(0);
        }
    },
    helpMessage: "Se o dono do bot mandar a mensagem \"!forceshutdown\", \"!quickshutdown\" ou \"!shutdown\", eu desligo imediatamente"
};

export default shutdown;
