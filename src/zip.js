import path from "path";
import fs from "fs";
import {createBrotliCompress, createBrotliDecompress} from "zlib";
import {state} from "../index.js";
import {checkExistence} from "./utils.js";

export const compressHandler = async (...args) => {
  const [filename, dirname] = args
  const filenamePath = path.resolve(state.currentFolderPath, filename)
  const dirnamePath = path.resolve(state.currentFolderPath, dirname)
  const newFilename = path.resolve(dirnamePath, filename + '.br')

  await checkExistence(filenamePath)

  const rs = fs.createReadStream(filenamePath)
  const ws = fs.createWriteStream(newFilename)
  const brotli = createBrotliCompress()

  rs.pipe(brotli).pipe(ws)

  return new Promise((res) => {
    rs.on('close', res)
  })
}

export const decompressHandler = async (...args) => {
  const [filename, dirname] = args
  const filenamePath = path.resolve(state.currentFolderPath, filename)
  const dirnamePath = path.resolve(state.currentFolderPath, dirname)
  const newFilename = path.resolve(dirnamePath, filename).split('.').slice(0, -1).join('.')

  await checkExistence(filenamePath)

  const rs = fs.createReadStream(filenamePath)
  const ws = fs.createWriteStream(newFilename)
  const brotli = createBrotliDecompress()

  rs.pipe(brotli).pipe(ws)

  return new Promise((res) => {
    rs.on('close', res)
  })
}
