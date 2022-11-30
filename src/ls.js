import fs from "fs";
import path from "path";
import {state} from "../index.js";
import {sortTable} from "./utils.js";

export const lsHandler = async () => {
  const filesNames = await fs.promises.readdir(state.currentFolderPath)

  const result = await filesNames.reduce(async (acc, fileName) => {
    const accum = await acc
    try {
      const isFile = (await fs.promises.stat(path.join(state.currentFolderPath, fileName))).isFile()
      accum.push({
        Name: fileName,
        Type: isFile ? 'file' : 'directory'
      })
      return accum
    } catch (e) {
      return accum
    }
  }, Promise.resolve([]))

  const sorted = sortTable(result)
  console.table(sorted)
}
