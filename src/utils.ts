import fs from "fs";
import https from "https";

export type ChatId = `${number}@g.us` | `${number}@c.us`

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

export async function generateUnusedFilename(fileType: string): Promise<string> {
    let file: string = `temp.${fileType}`;
    while (await fileExists(file)) {
        file += Math.random() + `.${fileType}`;
    }
    return file;
}
