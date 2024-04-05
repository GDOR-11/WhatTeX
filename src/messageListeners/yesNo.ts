import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "./MessageListener.js";

const yesNoPairs: [string, string][] = [
    ["sim", "nao"],
    ["positivo", "negativo"],
    ["afirmativo", "inafirmativo"],
    ["yuh huh", "nuh uh"],
    ["yeah", "nah"],
    ["yup", "nope"],
    ["yes", "no"],
    ["ja", "nein"],
];

const yesNo: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: caller => !caller.isMe,
    listener: (client, message) => {
        let body = message.body.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        for(let pair of yesNoPairs) {
            let msg = "";
            if(pair[0] == body) msg = pair[1];
            if(pair[1] === body) msg = pair[0];
            if(msg !== "") return client.sendText(message.chatId, msg, { quotedMsg: message.id });
        }
    },
    helpMessage: "Me diga sim e eu digo nao, me diga nao e eu digo sim"
};

export default yesNo;
