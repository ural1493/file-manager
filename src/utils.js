import path from "path";
import {state} from "../index.js";
import fs from "fs";

const USERNAME_OPTION = '--username'

export const sortTable = (arr) => [...arr]
  .sort((a, b) => {
    if (a.Type > b.Type) return 1;
    if (a.Type < b.Type) return -1
    return a.Name.localeCompare(b.Name, undefined, {sensitivity: 'accent'})
  })

export const getUsername = () => {
  const vars = process.argv.slice(2)
  const usernameArr = vars.find((option) => option.startsWith(USERNAME_OPTION))
  return usernameArr?.split('=').pop()
}

export const compose = (...fns) => {
  let result
  fns.reverse().filter(Boolean).forEach((fn) => result = result ? fn(result) : fn)
  return result
}

export const logCurrentDirWrapper = (cb) => async (...args) => {
  await cb(...args)
  console.log(`You are currently in ${state.currentFolderPath}`)
}


export const fnErrWrapper = (cb) => async (...args) => {
  try {
    await cb(...args)
  } catch (e) {
    if (e instanceof InvalidInputError || e instanceof OperationFailedError) {
      console.log(e.message)
      return
    }
    throw e
  }
}

export class InvalidInputError extends Error {
  constructor() {
    super('Invalid input');
  }
}

export class OperationFailedError extends Error {
  constructor() {
    super('Operation failed');
  }
}

export const addSuffixToFilename = (filenamePath, suffix) => {
  const {dir, name, ext} = path.parse(filenamePath)
  const newFilePath = name + suffix + ext
  return path.join(dir, newFilePath)
}

export const checkExistence = async (filenamePath) => {
  try {
    await fs.promises.access(filenamePath)
  } catch (e) {
    throw new OperationFailedError()
  }
}
