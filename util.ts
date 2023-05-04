import { Exercise } from "./exercise";

export async function runDay(day: { new(): Exercise }) {
    console.log(`\n\e[1m${day.name}\e[0m`)
    const instance = new day();
    const file = Bun.file(`input/${day.name.toLowerCase()}.txt`);
    instance.run(file)
}