import {Table} from "./ls";
import {currentFolderPath} from "../index";
import {cbWithFnArgs, FnArgs} from "./command";

const USERNAME_OPTION = '--username'

export const sortTable = (arr: Table[]) =>
  [...arr]
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

export const logCurrentDirWrapper = (cb: cbWithFnArgs) => (...args: FnArgs) => {
  cb(...args)
  console.log(`You are currently in ${currentFolderPath}`)
}


export const fnErrWrapper = (cb: cbWithFnArgs): cbWithFnArgs => async (...args) => {
  try {
    await cb(...args)
  } catch (e) {
    if(e instanceof InvalidInputError || e instanceof OperationFailedError) {
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