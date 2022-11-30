import OS from "os";
import * as readline from 'node:readline/promises';
import {getUsername, InvalidInputError, OperationFailedError} from "./src/utils.js";
import {fileManagerCommands} from "./src/command.js";

export const defaultPath = OS.homedir()
export const state = {
  currentFolderPath: defaultPath
}

const username = getUsername()
const byeMessage = `Thank you for using File Manager, ${username}, goodbye!`
const greetingMessage = `Welcome to the File Manager, ${username}!`

if (username) {
  console.log(greetingMessage)
}

const commands = fileManagerCommands

const parseCommand = (command) => command.split(' ')

const handleCommand = async (command) => {
  const [com, ...args] = parseCommand(command.toString())
  try {
    if (!commands[com]) throw new InvalidInputError()
    await commands[com](...args)
  } catch (e) {
    if (e instanceof InvalidInputError || e instanceof OperationFailedError) {
      console.log(e.message)
    }
  }
}

const handleExit = () => console.log(byeMessage)

const rl = readline.createInterface({ input: process.stdin });

rl.on('line', handleCommand)

process.on('SIGINT', handleExit)
process.on('exit', handleExit)
