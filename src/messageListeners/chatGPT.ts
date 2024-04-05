import MessageListener from "./MessageListener.js";
import { beforeExitAsync } from "../beforeExit.js";
import wppconnect from "@wppconnect-team/wppconnect";

import fs from "fs/promises";
const puppeteer = (await import("puppeteer-extra")).default.default;
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { generateUnusedFilename } from "../utils.js";

puppeteer.use(StealthPlugin());

// chatGPT API is paid, so I'm using puppeteer to use it for free instead lmao
// below is all the necessary code to handle chatGPT on the browser (will fail on startup sometimes)
const GPTLoader = (async () => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        handleSIGINT: false
    });

    const page = await browser.newPage();

    beforeExitAsync(async signal => {
        if(signal == "uncaughtExpection") {
            await page.screenshot({ path: "./error.png" });
        }
        await browser.close();
    });

    await page.goto("https://chat.openai.com");

    let element = await Promise.race([
        page.waitForSelector("[data-testid=\"login-button\"]"),
        page.waitForSelector("#prompt-textarea")
    ]);
    if(element === null) throw "this isn't even supposed to be possible, what the fuck (messageListeners/chatGPT.ts, line 35)";

    // if we got the button, we still need to log in
    if(await (await element.getProperty("tagName")).jsonValue() === "BUTTON") {
        console.log("logging into OpenAI account...");

        await page.click("[data-testid=\"login-button\"]");

        if(!process.env["CHATGPT_EMAIL"] || !process.env["CHATGPT_PASSWORD"]) {
            throw "CHATGPT_EMAIL and CHATGPT_PASSWORD environment variables not set!";
        }

        // some arbitrary timeouts, why not (I'm lazy to test if it works without them)
        await new Promise(r => setTimeout(r, 3000));
        page.keyboard.type(process.env["CHATGPT_EMAIL"] as string);
        await new Promise(r => setTimeout(r, 1000));
        await page.click("button");

        await new Promise(r => setTimeout(r, 1000));
        page.keyboard.type(process.env["CHATGPT_PASSWORD"] as string);
        await new Promise(r => setTimeout(r, 1000));
        (await page.$$("button"))[1].click();
        await new Promise(r => setTimeout(r, 5000));
    }

    console.log("chatGPT ready!");

    // array of prompts and callbacks
    let promptQueue: [string, (value: string) => Promise<void>][] = [];

    (async () => {
        while(true) {
            let prompt = promptQueue.shift();
            if(prompt == undefined) {
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }

            // type the prompt and press Meta + Enter (shortcut for sending the message)
            await page.keyboard.type(prompt[0]);
            await new Promise(r => setTimeout(r, 100));
            await page.keyboard.down("Meta");
            await page.keyboard.press("Enter");
            await page.keyboard.up("Meta");

            // wait until GPT is done cooking
            await new Promise(r => setTimeout(r, 1000))
            while(!await (await page.$(".final-completion"))?.$(".pr-2")) {
                await new Promise(r => setTimeout(r, 1000));
            }

            // get response
            let response = await page.$(".final-completion");
            let responseSize = await response?.boundingBox();
            if(!response || !responseSize) {
                // if response or its size are not avaible, shit happened. Take a screenshot, close the browser and throw an error
                await page.screenshot({ path: "error.png" });
                await browser.close();
                throw "error while getting final chatGPT completion";
            }
            await page.setViewport({
                width: 1500,
                height: responseSize.height + 500
            });
            let path = await generateUnusedFilename("png");
            await response.screenshot({ path });
            await prompt[1](path);
            await fs.unlink(path);
        }
    })();
    
    return function sendResponseImage(client: wppconnect.Whatsapp, to: string, prompt: string): Promise<void> {
        return new Promise(resolve => {
            promptQueue.push([prompt, async (filename: string) => {
                await client.sendImage(to, filename);
                resolve();
            }]);
        });
    }
})();

let sendResponseImage: null | ((client: wppconnect.Whatsapp, to: string, prompt: string) => Promise<void>) = null;
GPTLoader.then(func => sendResponseImage = func);

const chatGPT: MessageListener = {
    unseriousGroupsOnly: false,
    type: wppconnect.MessageType.CHAT,
    callerHasPermission: _caller => true,
    listener: async (client, message) => {
        let match = message.body.match(/^!ask[gG][pP][tT]\n(.*)/s);
        if(match === null) return;
        if(sendResponseImage === null) return;

        await sendResponseImage(client, message.chatId, match[1]);
    },
    helpMessage: "Comece uma mensagem com !gpt e uma quebra de linha que o chat GPT te respondera"
};

export default chatGPT;
