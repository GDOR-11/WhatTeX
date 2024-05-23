import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";

const repeat: MessageListener = {
    unseriousGroupsOnly: false,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => caller.isMe,
    listener: (client, message) => {
        let match = message.body.match(/^!repeat (\d+)\n(.*)/s);
        if (match === null) return;

        let [repetitions, messageToRepeat] = [Number(match[1]), match[2]];

        if (repetitions > 1000) {
            client.sendText(message.chatId, "fuck you, I'm not repeating it that many times");
            return;
        }

        for (let i = 0; i < repetitions; i++) {
            client.sendText(message.chatId, messageToRepeat);
        }
    },
    helpMessage: "comece uma mensagem com \"!repeat <n>\" e uma quebra de linha e eu vou repetir o que vier em baixo n vezes"
};

export default repeat;
