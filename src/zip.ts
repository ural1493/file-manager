import {cbWithFnArgs} from "./command";
import path from "path";
import {currentFolderPath} from "../index";
import fs, {createReadStream, createWriteStream} from "fs";
import {createBrotliCompress, createBrotliDecompress} from "zlib";
import {OperationFailedError} from "./utils";

export const compressHandler: cbWithFnArgs = async (...args) => {
  const [filename, dirname] = args
  const filenamePath = path.resolve(currentFolderPath, filename)
  const dirnamePath = path.resolve(currentFolderPath, dirname)
  const newFilename = path.resolve(dirnamePath, filename + '.br')

  try {
    await fs.promises.access(filenamePath)
    await fs.promises.access(newFilename)
  } catch (e) {
    throw new OperationFailedError()
  }

  const rs = createReadStream(filenamePath)
  const ws = createWriteStream(newFilename)
  const brotli = createBrotliCompress()

  rs.pipe(brotli).pipe(ws)

  return new Promise<void>((res) => {
    rs.on('close', res)
  })
}

export const decompressHandler: cbWithFnArgs = async (...args) => {
  const [filename, dirname] = args
  const filenamePath = path.resolve(currentFolderPath, filename)
  const dirnamePath = path.resolve(currentFolderPath, dirname)
  const newFilename = path.resolve(dirnamePath, filename).split('.').slice(0, -1).join('.')

  try {
    await fs.promises.access(filenamePath)
    await fs.promises.access(newFilename)
  } catch (e) {
    throw new OperationFailedError()
  }

  const rs = createReadStream(filenamePath)
  const ws = createWriteStream(newFilename)
  const brotli = createBrotliDecompress()

  rs.pipe(brotli).pipe(ws)

  return new Promise<void>((res) => {
    rs.on('close', res)
  })
}
