import * as fs from "fs";
import path from "path";
import {currentFolderPath} from "../index";
import {sortTable} from "./utils";

export interface Table {
  Name: string
  Type: string
}

export const lsHandler = async () => {
  const filesNames = await fs.promises.readdir(currentFolderPath)

  const result = await filesNames.reduce(async (acc, fileName) => {
    const accum = await acc
    try {
      const isFile = (await fs.promises.stat(path.join(currentFolderPath, fileName))).isFile()
      accum.push({
        Name: fileName,
        Type: isFile ? 'file' : 'directory'
      })
      return accum
    } catch (e) {
      return accum
    }
  }, Promise.resolve<Table[]>([]))

  const sorted = sortTable(result)
  console.table(sorted)
}
