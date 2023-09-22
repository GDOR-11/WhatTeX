import wppconnect from "@wppconnect-team/wppconnect";
import fs from "fs";
import https from "https";

export function downloadFileFromLink(filename: string, URL: string): Promise<void> {
    return new Promise(resolve => {
        let file = fs.createWriteStream(filename);
        https.get(URL, response => {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                resolve();
            });
        });
    });
}

export function fileExists(filename: string): Promise<boolean> {
    return new Promise(resolve => fs.stat(filename, (err, _stats) => resolve(err === null)));
}

export async function sendImageFromLink(client: wppconnect.Whatsapp, destination: string, URL: string, caption?: string, isViewOnce?: boolean, quotedMessageID?: string, filename?: string): Promise<{ack: number, id: string}> {
    let file: string = "temp.png";
    while(await fileExists(file)) {
        file += Math.random() + ".png";
    }
    await downloadFileFromLink(file, URL);
    let promise = await client.sendImage(destination, file, filename, caption, quotedMessageID, isViewOnce);
    fs.unlink(file, () => {});
    return promise;
}
