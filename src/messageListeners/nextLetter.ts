import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener.js";

const alphabet = "abcdefghijklmnopqrstuvwxyzαβγδεζηθικλμνξοπρστυφχψω";
function capitalize(str: string, letterIndex: number): string {
    return str.slice(0, letterIndex) + str[letterIndex].toUpperCase() + str.slice(letterIndex + 1);
}

const nextLetter: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: (client, message) => {
        let index = alphabet.indexOf(message.body.toLowerCase());
        if(index === -1) return;

        let continuation = alphabet.slice(index + message.body.length, index + 2 * message.body.length);
        for(let i = 0;i < continuation.length;i++) {
            let char = message.body[i];
            if(char === char.toUpperCase()) continuation = capitalize(continuation, i);
        }

        client.sendText(message.chatId, continuation);
    },
    helpMessage: "Diga uma parte ou letra do alfabeto que eu continuo"
};

export default nextLetter;
