"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wppconnect = __importStar(require("@wppconnect-team/wppconnect"));
const fs_1 = __importDefault(require("fs"));
wppconnect.create({
    session: "WhatTeX",
    autoClose: 0
}).then(client => start(client)).catch(error => { throw error; });
let messageListeners = [
    require("./messageListeners/greet").default,
    require("./messageListeners/helloThere").default,
    require("./messageListeners/renderLaTeX").default,
    require("./messageListeners/anarchyChess").default,
    require("./messageListeners/presentMyself").default,
    require("./messageListeners/homenagemProfessores").default,
    require("./messageListeners/quemPerguntou").default
];
let unseriousGroups = [];
fs_1.default.readFile("./unseriousGroups.txt", { encoding: "utf8" }, (error, data) => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
    unseriousGroups = data.split("\n");
});
function start(client) {
    for (let messageListener of messageListeners) {
        client.onAnyMessage(message => {
            if (message.sender.isMe && messageListener.blockMessagesFromMe) {
                if (message.body === undefined)
                    return;
                if (!message.body.startsWith("!test\n"))
                    return;
                let msg = Object.assign({}, message);
                msg.body = message.body.slice(message.body.indexOf("\n") + 1);
                messageListener.listener(client, msg);
                return;
            }
            if (messageListener.unseriousGroupsOnly && !unseriousGroups.includes(message.chatId))
                return;
            messageListener.listener(client, message);
        });
    }
    client.onAnyMessage(message => {
        if (message.body === undefined)
            return;
        if (!message.sender.isMe)
            return;
        if (message.body === "!setGroupAsUnserious" && !unseriousGroups.includes(message.chatId))
            unseriousGroups.push(message.chatId);
        if (message.body === "!setGroupAsSerious") {
            let idx = unseriousGroups.indexOf(message.chatId);
            if (idx === -1)
                return;
            unseriousGroups.splice(idx, 1);
        }
    });
    process.on("exit", () => {
        console.log("writing data to unseriousGroups.txt...");
        fs_1.default.writeFileSync("./unseriousGroups.txt", unseriousGroups.join("\n"));
        console.log("successfully saved unserious groups to file!");
        process.exit(0);
    });
}
