import path from "path";
import fs from "fs";
import {createHash} from "crypto";
import {state} from "../index.js";
import {OperationFailedError} from "./utils.js";

export const hashHandle = async (filePath) => {
  const file = path.resolve(state.currentFolderPath, filePath)
  try {
    await fs.promises.access(file)
  } catch (e) {
    throw new OperationFailedError()
  }
  const data = await fs.promises.readFile(file, 'utf-8')

  const hash = createHash('sha256').update(data.toString()).digest('hex')
  console.log(hash)
}
