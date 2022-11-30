import {state} from "../index.js";

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
  constructor(message) {
    super(`Invalid input: ${message}`);
  }
}

export class OperationFailedError extends Error {
  constructor() {
    super('Operation failed');
  }
}