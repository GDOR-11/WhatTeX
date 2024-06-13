import wppconnect from "@wppconnect-team/wppconnect";
import MessageListener from "../MessageListener.js";
import path from "path";
import fs from "fs";

const communism_words = ["comunismo", "comunista", "communist", "commie", "communism", "socialist", "socialism", "soviético", "soviet", "urss", "ussr", "cccp", "lulista", " pt ", "partido dos trabalhadores", "karl", "marx", "carlos marcos", "lula", "dilma", "roussef", "haddad", "russia", "rússia", "comrade", "vermelh", "red", "companhero", "companheiro", "faz o l"];

const communism: MessageListener = {
    unseriousGroupsOnly: true,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: _caller => true,
    listener: (client: wppconnect.Whatsapp, message: wppconnect.Message) => {
        if (!message.body) return;
        let lowerCase = message.body.toLowerCase();

        for (let word of communism_words) {
            if (lowerCase.includes(word)) {
                sendRandomCommunistSticker(client, message.chatId);
                return;
            }
        }
    },
    helpMessage: "mencione a ameaca vermelha e eu mando uma figurinha comunista"
};

// instead of reading the files every time communism is needed, we read the files beforehand and then we just send the files.
// in other words, instead of using storage, we use memory.
// In case RAM usage gets too high, it would be ideal to convert this to the trivial implementation (reading the files every time the function is called)
const sendRandomCommunistSticker = (() => {

    const communistStickersFolder = "./images/communism";

    /** all the communism requests that have been made before the files have been read */
    let pendingMessages: { client: wppconnect.Whatsapp, recipient: string }[] = [];

    let communistStickers: { path: string, content: string }[] = [];

    const mimeTypeOf = (file: string) => {
        let split = file.split(".");
        return "image/" + split[split.length - 1];
    };
    fs.readdir(communistStickersFolder, (err, files) => {
        if (err) {
            console.error(err);
            process.emit("SIGINT");
        }

        communistStickers.length = files.length;
        for (let i = 0; i < files.length; i++) {
            let filepath = path.join(communistStickersFolder, files[i]);
            fs.readFile(filepath, { encoding: "base64" }, (err, base64) => {
                if (err) {
                    console.error(err);
                    process.emit("SIGINT");
                }

                communistStickers[i] = { path: filepath, content: `data:${mimeTypeOf(filepath)};base64,${base64}` };
            });
        }

        for (let pendingMessage of pendingMessages) sendRandomCommunistSticker(pendingMessage.client, pendingMessage.recipient);
    });

    /** this function should only ever be called after communistStickers has been set */
    function sendRandomCommunistSticker(client: wppconnect.Whatsapp, recipient: string) {
        let stickerIndex = Math.floor(communistStickers.length * Math.random());
        let sticker = communistStickers[stickerIndex];

        if (sticker.path.endsWith(".gif")) {
            client.sendImageAsStickerGif(recipient, sticker.content);
        } else {
            client.sendImageAsSticker(recipient, sticker.content);
        }
    }

    return (client: wppconnect.Whatsapp, recipient: string) => {
        if (!communistStickers) {
            pendingMessages.push({ client, recipient });
        } else {
            sendRandomCommunistSticker(client, recipient);
        }
    }
})();

export default communism;
