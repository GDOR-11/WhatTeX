import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";

const getChatId: MessageListener = {
    unseriousGroupsOnly: false,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => caller.isMe,
    listener: async (client, message) => {
        const match = message.body.match(/^!get[cC]hat[iI][dD]s?[ \n](.*)$/);
        if (match === null) return;

        const regex = match[1];
        let chats = await client.listChats();
        chats = chats.filter(chat => chat.contact.formattedName.match(regex) !== null);

        const response = chats.map(chat => `${chat.contact.formattedName}: ${chat.id.user}@${chat.id.server}`).join("\n");
        await client.sendText(message.chatId, response);
    },
    helpMessage: "Se o dono do bot comecar uma mensagem com !getChatId e continuar com uma regex, eu respondo com os IDs dos chats que são aceitos pela regex (coisa tecnica)"
};

export default getChatId;
