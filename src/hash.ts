import path from "path";
import fs from "fs";
import {createHash} from "crypto";
import {currentFolderPath} from "../index";
import {OperationFailedError} from "./utils";

export const hashHandle = async (filePath: string) => {
  const file = path.resolve(currentFolderPath, filePath)
  try {
    await fs.promises.access(file)
  } catch (e) {
    throw new OperationFailedError()
  }
  const data = await fs.promises.readFile(file, 'utf-8')

  const hash = createHash('sha256').update(data.toString()).digest('hex')
  console.log(hash)
}
