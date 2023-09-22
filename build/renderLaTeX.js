"use strict";
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
exports.renderLaTeX = void 0;
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
function renderLaTeX(client, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.body === undefined)
            return;
        let destination = message.isGroupMsg ? message.chatId : message.from;
        if (!message.body.toLowerCase().startsWith("!renderlatex\n"))
            return;
        let sections = message.body.split("\n");
        sections.shift();
        let URL = textToLatex(sections);
        yield downloadFileFromLink("WhatTeX temporary equation.png", URL);
        yield client.sendImage(destination, "WhatTeX temporary equation.png", "LaTeX equation", "");
        fs_1.default.unlink("WhatTeX temporary equation.png", () => { });
    });
}
exports.renderLaTeX = renderLaTeX;
function textToLatex(text) {
    let sections = typeof text === "string" ? text.split("\n") : text;
    let latex_code = "";
    for (let section of sections) {
        if (section.startsWith("$") && section.endsWith("$")) {
            latex_code += "\\\\\\\\" + section.slice(1, -1);
        }
        else {
            latex_code += "\\\\\\\\\\text{" + section.replace("}", "\\}").replace("$", "\\$") + "}";
        }
    }
    return "https://latex.codecogs.com/png.image?\\dpi{300}" + latex_code;
}
function downloadFileFromLink(filename, URL) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            let file = fs_1.default.createWriteStream(filename);
            https_1.default.get(URL, response => {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    resolve();
                });
            });
        });
    });
}
