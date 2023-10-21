"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const communism_words = ["comunismo", "comunista", "communism", "sovietico", "soviético", "soviet", "urss", "ussr", "cccp", "lula", "russia", "rússia", "comrade"];
const communism = {
    blockMessagesFromMe: true,
    unseriousGroupsOnly: true,
    listener: (client, message) => {
        if (message.body === undefined)
            return;
        let lowerCase = message.body.toLowerCase();
        for (let word of communism_words) {
            if (lowerCase.includes(word)) {
                sendRandomCommunistSticker(client, message.chatId);
                return;
            }
        }
    }
};
// instead of reading the files every time communism is needed, we read the files beforehand and then we just send the files.
// in other words, instead of using storage, we use memory.
// In case RAM usage gets too high, it would be ideal to convert this to the trivial implementation (reading the files every time the function is called)
const sendRandomCommunistSticker = (() => {
    const communistStickersFolder = "./images/communism";
    /** all the communism requests that have been made before the files have been read */
    let pendingMessages = [];
    let communistStickers = [];
    const mimeTypeOf = (file) => {
        let split = file.split(".");
        return "image/" + split[split.length - 1];
    };
    fs_1.default.readdir(communistStickersFolder, (err, files) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        communistStickers.length = files.length;
        for (let i = 0; i < files.length; i++) {
            let filepath = path_1.default.join(communistStickersFolder, files[i]);
            fs_1.default.readFile(filepath, { encoding: "base64" }, (err, base64) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                communistStickers[i] = { path: filepath, content: `data:${mimeTypeOf(filepath)};base64,${base64}` };
            });
        }
        for (let pendingMessage of pendingMessages)
            sendRandomCommunistSticker(pendingMessage.client, pendingMessage.recipient);
    });
    /** this function should only ever be called after communistStickers has been set */
    function sendRandomCommunistSticker(client, recipient) {
        let stickerIndex = Math.floor(communistStickers.length * Math.random());
        let sticker = communistStickers[stickerIndex];
        if (sticker.path.endsWith(".gif")) {
            client.sendImageAsStickerGif(recipient, sticker.content);
        }
        else {
            client.sendImageAsSticker(recipient, sticker.content);
        }
    }
    return (client, recipient) => {
        if (!communistStickers) {
            pendingMessages.push({ client, recipient });
        }
        else {
            sendRandomCommunistSticker(client, recipient);
        }
    };
})();
exports.default = communism;
