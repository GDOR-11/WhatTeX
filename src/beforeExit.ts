let listeners: ((signal: string, ...args: any) => Promise<void>)[] = [];
let exiting = false;

export function beforeExit(listener: (signal: string, ...args: any) => any) {
    listeners.push(async (signal, ...args) => listener(signal, ...args));
}
export function beforeExitAsync(listener: (signal: string, ...args: any) => Promise<any>) {
    listeners.push(listener);
}

for (let signal of ["SIGINT", "beforeExit", "uncaughtException"]) {
    process.on(signal, async (...args) => {
        if (exiting) return;
        exiting = true;

        console.log(`Exiting because of signal ${signal} with the following arguments:\n${args.join("\n")}\n`);

        await Promise.allSettled(listeners.map(listener => listener(signal, ...args)));
        process.exit(0);
    });
}
