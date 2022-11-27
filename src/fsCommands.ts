import * as path from "path";
import {currentFolderPath} from "../index";
import {ArgType, cbWithFnArgs, validators} from "./command";
import * as fs from "fs";
import {createReadStream, createWriteStream} from "fs";
import os from "os";
import {OperationFailedError} from "./utils";

export const catHandler = async (filePath: string) => {
  console.log('cat')
  const resultPath = path.resolve(currentFolderPath, filePath)
  try {
    console.log('before access')
    await fs.promises.access(resultPath)
    console.log('after access')
  } catch (e) {
    console.log('cat catch')
    throw new OperationFailedError()
  }
  const rs = fs.createReadStream(resultPath)
  rs.pipe(process.stdout)
  rs.on('close', () => {
    process.stdout.write(os.EOL)
  })
}

export const addHandler = async (filePath: string) => {
  validators[ArgType.FILE](filePath)
  const resultPath = path.resolve(currentFolderPath, filePath)
  try {
    await fs.promises.writeFile(resultPath, '', {flag: 'wx'})
  } catch (e) {
    throw new OperationFailedError()
  }
}

export const rmHandler = async (filePath: string) => {
  validators[ArgType.FILE](filePath)
  const resultPath = path.resolve(currentFolderPath, filePath)
  try {
    await fs.promises.access(resultPath)
    await fs.promises.unlink(resultPath)
  } catch (e) {
    throw new OperationFailedError()
  }
}

export const rnHandler: cbWithFnArgs = async (...args) => {
  const [prev, next] = args
  const prevPath = path.resolve(currentFolderPath, prev)
  const nextPath = path.resolve(currentFolderPath, next)
  try {
    await fs.promises.access(prevPath)
    await fs.promises.rename(prevPath, nextPath) // TODO
  } catch (e) {
    throw new OperationFailedError()
  }
}

export const cpHandler: cbWithFnArgs = async (...args) => {
  const [filename, dirname] = args
  const filenamePath = path.resolve(currentFolderPath, filename)
  const dirnamePath = path.resolve(currentFolderPath, dirname)
  const newFilename = path.resolve(dirnamePath, filename)
  let isExist = false
  let newCopyFilename

  try {
    await fs.promises.access(filenamePath)
  } catch (e) {
    throw new OperationFailedError()
  }

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

const fromCpToMv = (cb: cbWithFnArgs): cbWithFnArgs => async (...args) => {
  const [filename] = args
  const filenamePath = path.resolve(currentFolderPath, filename)
  await cb(...args)
  await fs.promises.unlink(filenamePath)
}

export const mvHandler: cbWithFnArgs = fromCpToMv(cpHandler)
