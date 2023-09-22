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
exports.sendImageFromLink = exports.fileExists = exports.downloadFileFromLink = void 0;
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
function downloadFileFromLink(filename, URL) {
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
}
exports.downloadFileFromLink = downloadFileFromLink;
function fileExists(filename) {
    return new Promise(resolve => fs_1.default.stat(filename, (err, _stats) => resolve(err === null)));
}
exports.fileExists = fileExists;
function sendImageFromLink(client, destination, URL, caption, isViewOnce, quotedMessageID, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        let file = "temp.png";
        while (yield fileExists(file)) {
            file += Math.random() + ".png";
        }
        yield downloadFileFromLink(file, URL);
        let promise = yield client.sendImage(destination, file, filename, caption, quotedMessageID, isViewOnce);
        fs_1.default.unlink(file, () => { });
        return promise;
    });
}
exports.sendImageFromLink = sendImageFromLink;
