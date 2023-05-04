import { Exercise } from "../exercise";

type LsFile = ['dir', string] | ['file', {name: string, size: number}]
type CdCommand = ['cd', string]
type LsCommand = ['ls', string]
type CommandArray = LsCommand | CdCommand
type LsOutput = LsFile[]
type Command = [CdCommand] | [LsCommand, LsOutput]

export class Day7 implements Exercise {
    parseLsFile(output: string): LsFile {
        return null!!;
    }
    async run(input: Blob) {
        const content = await input.text();
        const lines = content.split('\n');
        const commands = <Command[]>[];

        for(const line of lines) {
            if(line.startsWith("$ ")) {
                const command = line.substring(2).split(' ') as CommandArray;

                switch(command[0]) {
                    case "cd":
                        commands.push([command]);
                        break;
                    case "ls":
                        commands.push([command, []]);
                }
            } else {
                const cmd = commands[commands.length-1];
                
            }
        }
    }
}