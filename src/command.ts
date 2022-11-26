import {logCurrentDirWrapper} from "./utils";

export enum ArgType {
  FILE = 'file',
  FOLDER = 'folder',
  OPTION = 'option',
}
export  type FnArgs = string[]
export  type cbWithFnArgs = (...args: FnArgs) => void

export interface Arg {
  type: ArgType
  required?: boolean
}

export interface Options {
  args?: Arg[]
  showCurrentDirAfterExec?: boolean
  handler: (...args: FnArgs) => void
}

const defaultOptions: Options = {
  showCurrentDirAfterExec: true,
  args: undefined,
  handler: (...args: FnArgs) => {}
}

export const validators = {
  [ArgType.FILE]: (arg: string) => {
    if (arg.split('.').length < 2) {
      throw new Error(arg + ' is not file!')
    }
  },
  [ArgType.OPTION]: (arg: string) => {
    if(!arg.startsWith('--')) {
      throw new Error(arg + ' is not option!')
    }
  },
  [ArgType.FOLDER]: (arg: string) => {
    if (arg.split('.').length > 1) {
      throw new Error(arg + ' is not folder!')
    }
  }
}

const validate = (cb: Options['handler'], argOptions?: Arg[]) => (...args: FnArgs) => {
  argOptions?.forEach(({required, type}, i) => {
    const currentArg = args[i]
    if (required && !currentArg) {
      throw new Error(type + ' required!')
    }
    validators[type](currentArg)
  })
  cb(...args) // TODO сделать throw
}

export const createCommand = (options: Options) => {
  const opts = {...defaultOptions, ...options}
  const {showCurrentDirAfterExec, args, handler} = opts

  const res = showCurrentDirAfterExec ? logCurrentDirWrapper(handler) : handler

  return validate(res, args)
}