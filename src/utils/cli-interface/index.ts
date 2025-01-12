import { Interface, createInterface } from 'node:readline/promises';

export const newInterface = (): Interface => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return rl;
};
