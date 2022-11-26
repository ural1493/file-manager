import * as path from "path";
import {ls} from "./ls";
import {cd, up} from "./cd";
import {getUsername} from "./utils";
import {FnArgs} from "./command";
import {add, cp, mv, rm, rn, cat} from "./fsCommands";

type Commands = Record<string, (...args: FnArgs) => void>

export const defaultPath = path.resolve('/')
export let currentFolderPath = defaultPath

const username = getUsername()
const byeMessage = `Thank you for using File Manager, ${username}, goodbye!`
const greetingMessage = `Welcome to the File Manager, ${username}!`

if (username) {
  console.log(greetingMessage)
}

const commands: Commands = {
  ls,
  cd,
  up,
  cat,
  add,
  rm,
  rn,
  cp,
  mv,
  '.exit': () => {
    process.exit(0)
  }
}

const parseCommand = (command: string) => {
  command = command.trim()
  return command.split(' ')
}

const handleCommand = async (command: string | Buffer) => {
  const [com, ...args] = parseCommand(command.toString())
  try {
    await commands[com](...args)
  } catch (e) {
    console.log(e)
    console.log('catch')
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
