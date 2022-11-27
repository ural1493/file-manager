import * as path from "path";
import {currentFolderPath} from "../index";
import {FnArgs} from "./command";
import * as fs from "fs";
import {InvalidInputError} from "./utils";

export const cdHandler = async (...args: FnArgs) => {
  const newPath = path.resolve(currentFolderPath, ...args)
  try {
    await fs.promises.access(newPath)
    // @ts-ignore
    currentFolderPath = newPath
  } catch (e) {
    throw new InvalidInputError()
  }
}

export const upHandler = () => cdHandler(currentFolderPath, '..')
