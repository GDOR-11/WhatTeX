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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wppconnect = __importStar(require("@wppconnect-team/wppconnect"));
const promises_1 = __importDefault(require("fs/promises"));
const readline_1 = __importDefault(require("readline"));
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
    require("./messageListeners/quemPerguntou").default,
    require("./messageListeners/bruh").default,
    require("./messageListeners/communism").default
];
let unseriousGroups = [];
promises_1.default.readFile("./unseriousGroups.txt", { encoding: "utf8" }).then(data => {
    unseriousGroups = data.split("\n");
}).catch(error => {
    console.error(error);
    process.exit(1);
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
        if (message.body === "!allowBot" && !unseriousGroups.includes(message.chatId))
            unseriousGroups.push(message.chatId);
        if (message.body === "!disallowBot") {
            let idx = unseriousGroups.indexOf(message.chatId);
            if (idx === -1)
                return;
            unseriousGroups.splice(idx, 1);
        }
    });
    const rl = readline_1.default.createInterface(process.stdin);
    rl.on("line", (line) => __awaiter(this, void 0, void 0, function* () {
        if (line.toLowerCase() === "q") {
            try {
                console.log("Writing data to unseriousGroups.txt...");
                yield promises_1.default.writeFile("./unseriousGroups.txt", unseriousGroups.join("\n"));
            }
            catch (err) {
                console.error(`Could not save data:\n\n${err}\n`);
                console.error(`If the issue persists, exit with Control+C and manually write the following data to unseriousGroups.txt:\n${unseriousGroups.join("\n")}`);
            }
            yield client.logout();
            process.exit(0);
        }
    }));
}
