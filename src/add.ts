import * as path from "path";
import {currentFolderPath} from "./index";
import {ArgType, cbWithFnArgs, createCommand, validators} from "./command";
import * as fs from "fs";
import {createReadStream, createWriteStream} from "fs";

const addHandler = async (filePath: string) => {
  validators[ArgType.FILE](filePath) // TODO
  const resultPath = path.resolve(currentFolderPath, filePath)
  await fs.promises.writeFile(resultPath, '') // TODO
}

export const add = createCommand({
  args: [
    {type: ArgType.FILE, required: true}
  ],
  handler: addHandler
})

const rmHandler = async (filePath: string) => {
  validators[ArgType.FILE](filePath) // TODO
  const resultPath = path.resolve(currentFolderPath, filePath)
  await fs.promises.unlink(resultPath) // TODO
}

export const rm = createCommand({
  args: [
    {type: ArgType.FILE, required: true}
  ],
  handler: rmHandler
})

const rnHandler: cbWithFnArgs = async (...args) => {
  const [prev, next] = args
  const prevPath = path.resolve(currentFolderPath, prev)
  const nextPath = path.resolve(currentFolderPath, next)
  await fs.promises.rename(prevPath, nextPath) // TODO
}

export const rn = createCommand({
  args: [
    {type: ArgType.FILE, required: true},
    {type: ArgType.FILE, required: true}
  ],
  handler: rnHandler
})

const cpHandler: cbWithFnArgs = async (...args) => {
  const [prev, next] = args
  const prevPath = path.resolve(currentFolderPath, prev)
  const nextPath = path.resolve(currentFolderPath, next)

  console.log({prevPath, nextPath})

  // const rs = createReadStream(prevPath)
  // const ws = createWriteStream(nextPath)
  // rs.pipe(ws)
}

export const cp = createCommand({
  args: [
    {type: ArgType.FILE, required: true},
    {type: ArgType.FOLDER, required: true}
  ],
  handler: cpHandler
})
