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

function isFile(tree: FileTree): tree is FileTreeFile { return tree[0] == 'file' && !Number.isNaN(tree[1].size) }
function isDir(tree: FileTree): tree is FileTreeDir { return tree[0] == 'dir' }

function dirSize(dir: FileTreeDir): number {
    return dir[2].filter(isFile)
                 .map(f => f[1].size)
                 .reduce((prev, current) => prev + current, 0)

         + dir[2].filter(isDir)
                 .map(dirSize)
                 .map(s => (console.log(s),s))
                 .reduce((prev, current) => prev + current, 0);
}
function dirsUnderSize(dir: FileTreeDir, max: number): number {
    return dir[2].filter(isDir)
                 .map(dirSize)
                 .filter(size => size <= max)
                 .map(s => (console.log(s),s))
                 .reduce((prev, cur) => prev + cur, 0)

         + dir[2].filter(isDir)
                 .map(d => dirsUnderSize(d, max))
                 .reduce((prev, cur) => prev + cur, 0)
}

function treeify(commands: Command[]): FileTreeDir {
  let currentDir = '/';
  let tree: FileTreeDir = ['dir', currentDir, []];
  let treeFor = ((path: string) => path.split('/').filter(p => p != '').reduce((value, segment) => value[2].find((d: FileTree) => isDir(d) && d[1] == segment), tree)) as (path: string) => FileTreeDir;
  for(const cmd of commands) {
    switch(cmd[0][0]) {
      case "ls":
        const files = cmd[1]!;
        for(const file of files)  {
          if(file[0] == 'file') treeFor(currentDir)[2].push(file);
          else treeFor(currentDir)[2].push(['dir', file[1], []]);
        }
        break;
      case "cd":
        if(cmd[0][1] == '..') {

        }
        let newTree: FileTreeDir | undefined;
        if((newTree = treeFor(currentDir)[2].find((f => isDir(f) && f[1] == cmd[0][1]) as (f: FileTree) => f is FileTreeDir)) == undefined) {
            newTree = ['dir', cmd[0][1], []];
            treeFor(currentDir)[2].push(newTree);
        }
        currentDir = path;
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
    console.log(files);
    console.log("Part 1: " + dirsUnderSize(files, 100000))
}
