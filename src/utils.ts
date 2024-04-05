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

export async function generateUnusedFilename(extension: string): Promise<string> {
    let file: string = `temp.${extension}`;
    while(await fileExists(file)) {
        file += Math.random() + `.${extension}`;
    }
    return file;
}
