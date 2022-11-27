// import * as path from "path";
import {getUsername, InvalidInputError, OperationFailedError} from "./src/utils";
import {fileManagerCommands, FnArgs} from "./src/command";
import OS from "os";

type Commands = Record<string, (...args: FnArgs) => void>

// export const defaultPath = path.resolve('/PROGA/rs-nodejs/file-manager')
export const defaultPath = OS.homedir()
export let currentFolderPath = defaultPath

const username = getUsername()
const byeMessage = `Thank you for using File Manager, ${username}, goodbye!`
const greetingMessage = `Welcome to the File Manager, ${username}!`

if (username) {
  console.log(greetingMessage)
}

const commands: Commands = fileManagerCommands

const parseCommand = (command: string) => {
  command = command.trim()
  return command.split(' ')
}

const handleCommand = async (command: string | Buffer) => {
  const [com, ...args] = parseCommand(command.toString())
  try {
    if (!commands[com]) throw new InvalidInputError()
    await commands[com](...args)
  } catch (e) {
    if(e instanceof InvalidInputError || e instanceof OperationFailedError) {
      console.log(e.message)
      return
    }
  }
}

const handleExit = () => console.log(byeMessage)

process.stdin.on('data', handleCommand)

process.on('SIGINT', () => {
  handleExit()
})
process.on('exit', () => {
  handleExit()
})
