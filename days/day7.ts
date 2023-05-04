import * as path from 'node:path'

type FileInfo = {name: string, size: number}
type LsFile = ['dir', string] | ['file', FileInfo]
type CdCommand = ['cd', string]
type LsCommand = ['ls', string]
type CommandArray = LsCommand | CdCommand
type LsOutput = LsFile[]
type Command = [CdCommand] | [LsCommand, LsOutput]
type FileTreeFile = ['file', FileInfo]
type FileTreeDir = ['dir', string, FileTree[]]
type FileTree = FileTreeFile | FileTreeDir

function treeify(commands: Command[]): FileTree {
  let currentDir = '/';
  let tree: FileTree = ['dir', currentDir, []];
  let currentTree = tree;
  for(const cmd of commands) {
    switch(cmd[0][0]) {
      case "ls":
        const files = cmd[1]!;
        for(const file of files)  {
          if(file[0] == 'file') currentTree[2].push(file);
        }
        break;
      case "cd":
        let newTree: FileTree = ['dir', path.normalize(path.join(currentTree[1], cmd[0][1])), []];
        currentTree[2].push(newTree);
        currentTree = newTree;
        break;
    }
  }
  return tree;
}

function parseLsFile(line: string): LsFile {
    if(line.startsWith('dir ')) return line.split(' ') as ['dir', string];
    else {
        const parts = line.split(' ')
        return ['file',
            {
                name: parts[1],
                size: parseInt(parts[0])
            }
        ]
    }
}

export async function day7(input: Blob) {
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
            if(cmd[0][0] == 'ls') {
                cmd[1]?.push(parseLsFile(line));
            }
        }
    }

    const files = treeify(commands);
}
