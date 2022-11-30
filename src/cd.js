import path from "path";
import fs from "fs";
import {state} from "../index.js";
import {InvalidInputError} from "./utils.js";

export const cdHandler = async (...args) => {
  const newPath = path.resolve(state.currentFolderPath, ...args)
  console.log({newPath, args})
  try {
    await fs.promises.access(newPath)
    state.currentFolderPath = newPath
    console.log(`You are currently in ${state.currentFolderPath}`)
  } catch (e) {
    throw new InvalidInputError()
  }
}

export const upHandler = () => cdHandler(state.currentFolderPath, '..')
