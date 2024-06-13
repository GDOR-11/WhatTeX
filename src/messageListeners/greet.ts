import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";

// good luck future me, I have made this as unreadable as I possibly can so you can practice your regex skills
const greetings = [
    /^o(i+|pa)$/, /^bo(m dia+|a (tarde|noite))$/, /^[ei]+a[ei]+$/,
    /^t(z|t|x|ch)+a(u|l)+$/,
    /^h(i+|e(y+|ll+o))$/,
    /^(bye|bai)( bye| bai)?$/, /^(good|gudi)(bye|bai)$/,
    /^hallo$/,
    /^tchü(ss|ß)$/, /^ciao$/
];

const greet: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: (client, message) => {
        if (!message.body) return;
        let lowerCase = message.body.toLowerCase();
        for (let greeting of greetings) {
            if (lowerCase.match(greeting) !== null) {
                return client.sendText(message.chatId, message.body);
            }
        }
    },
    helpMessage: "respondo automaticamente a um \"oi\" (ou similares)"
};

export default greet;
