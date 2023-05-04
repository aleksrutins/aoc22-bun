import { Exercise } from "./exercise";

export async function runDay(day: Exercise) {
    console.log(`\n\x1b[4m${day.name.toLowerCase().replace(/day(\d+?)/, 'Day $1')}\x1b[0m`)
    const file = Bun.file(`input/${day.name.toLowerCase()}.txt`);
    day(file);
}
