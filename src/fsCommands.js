import path from "path";
import fs from "fs";
import os from "os";
import {state} from "../index.js";
import {ArgType, validators} from "./command.js";
import {OperationFailedError} from "./utils.js";

export const catHandler = async (filePath) => {
  const resultPath = path.resolve(currentFolderPath, filePath)
  try {
    await fs.promises.access(resultPath)
  } catch (e) {
    throw new OperationFailedError()
  }
  const rs = fs.createReadStream(resultPath)
  rs.pipe(process.stdout)
  rs.on('close', () => {
    process.stdout.write(os.EOL)
  })
}

export const addHandler = async (filePath) => {
  validators[ArgType.FILE](filePath)
  const resultPath = path.resolve(state.currentFolderPath, filePath)
  try {
    await fs.promises.writeFile(resultPath, '', {flag: 'wx'})
  } catch (e) {
    throw new OperationFailedError()
  }
}

export const rmHandler = async (filePath) => {
  validators[ArgType.FILE](filePath)
  const resultPath = path.resolve(state.currentFolderPath, filePath)
  try {
    await fs.promises.access(resultPath)
    await fs.promises.unlink(resultPath)
  } catch (e) {
    throw new OperationFailedError()
  }
}

export const rnHandler = async (...args) => {
  const [prev, next] = args
  const prevPath = path.resolve(state.currentFolderPath, prev)
  const nextPath = path.resolve(state.currentFolderPath, next)
  try {
    await fs.promises.access(prevPath)
    await fs.promises.rename(prevPath, nextPath)
  } catch (e) {
    throw new OperationFailedError()
  }
}

export const cpHandler = async (...args) => {
  const [filename, dirname] = args
  const filenamePath = path.resolve(state.currentFolderPath, filename)
  const dirnamePath = path.resolve(state.currentFolderPath, dirname)
  const newFilename = path.resolve(dirnamePath, filename)
  let isExist = false
  let newCopyFilename
debugger
  console.log({
    filenamePath,
    dirnamePath,
    newFilename
  })

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
    const copyFilename = [...arr, ext].join('.')
    newCopyFilename = path.resolve(dirnamePath, copyFilename)
  }

  const rs = fs.createReadStream(filenamePath)
  const ws = fs.createWriteStream(isExist ? newCopyFilename : newFilename)
  rs.pipe(ws)

  return new Promise((res) => {
    rs.on('close', res)
  })
}

const fromCpToMv = (cb) => async (...args) => {
  const [filename] = args
  const filenamePath = path.resolve(state.currentFolderPath, filename)
  await cb(...args)
  await fs.promises.unlink(filenamePath)
}

export const mvHandler = fromCpToMv(cpHandler)
