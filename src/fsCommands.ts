import * as path from "path";
import {currentFolderPath} from "./index";
import {ArgType, cbWithFnArgs, createCommand, validators} from "./command";
import * as fs from "fs";
import {createReadStream, createWriteStream} from "fs";
import os from "os";

const catHandler = async (filePath: string) => {
  const resultPath = path.resolve(currentFolderPath, filePath)
  await fs.promises.access(resultPath) // TODO
  const rs = fs.createReadStream(resultPath)
  rs.pipe(process.stdout)
  rs.on('close', () => {
    process.stdout.write(os.EOL)
  })
}

export const cat = createCommand({
  args: [
    {type: ArgType.FILE, required: true}
  ],
  handler: catHandler
})

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
  const [filename, dirname] = args
  const filenamePath = path.resolve(currentFolderPath, filename)
  const dirnamePath = path.resolve(currentFolderPath, dirname)
  const newFilename = path.resolve(dirnamePath, filename)
  let isExist = false
  let newCopyFilename

  // cd PROGA/rs-nodejs/file-manager

  try {
    await fs.promises.access(newFilename)
    isExist = true
  } catch (e) {
  }

  if (isExist) {
    const arr = filename.split('.')
    const ext = arr.pop()
    arr[arr.length - 1] += '(copy)'
    newCopyFilename = [...arr, ext].join('.')
  }

  const rs = createReadStream(filenamePath)
  const ws = createWriteStream(newCopyFilename || newFilename)
  rs.pipe(ws)

  return new Promise<void>((res) => {
    rs.on('close', res)
  })
}

export const cp = createCommand({
  args: [
    {type: ArgType.FILE, required: true},
    {type: ArgType.FOLDER, required: true}
  ],
  handler: cpHandler
})

const fromCpToMv = (cb: cbWithFnArgs): cbWithFnArgs => async (...args) => {
  const [filename] = args
  const filenamePath = path.resolve(currentFolderPath, filename)
  await cb(...args)
  await fs.promises.unlink(filenamePath)
}

const mvHandler: cbWithFnArgs = fromCpToMv(cpHandler)

export const mv = createCommand({
  args: [
    {type: ArgType.FILE, required: true},
    {type: ArgType.FOLDER, required: true}
  ],
  handler: mvHandler
})
