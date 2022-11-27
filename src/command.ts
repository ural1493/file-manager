import {fnErrWrapper, InvalidInputError, logCurrentDirWrapper} from "./utils";
import {osHandler} from "./os";
import {addHandler, catHandler, cpHandler, mvHandler, rmHandler, rnHandler} from "./fsCommands";
import {cdHandler, upHandler} from "./cd";
import {lsHandler} from "./ls";
import {hashHandle} from "./hash";
import {compressHandler, decompressHandler} from "./zip";

export enum ArgType {
  FILE = 'file',
  FOLDER = 'folder',
  OPTION = 'option',
}

export type FnArgs = string[]
export type cbWithFnArgs = (...args: FnArgs) => void | Promise<void>

export interface Arg {
  type: ArgType
  required?: boolean
}

export interface Options {
  args?: Arg[]
  showCurrentDirAfterExec?: boolean
  handler: cbWithFnArgs
}

const defaultOptions: Options = {
  showCurrentDirAfterExec: true,
  args: undefined,
  handler: (...args: FnArgs) => {
  }
}

export const validators = {
  [ArgType.FILE]: (arg: string) => {
    if (arg.split('.').length < 2) {
      throw new InvalidInputError()
    }
  },
  [ArgType.OPTION]: (arg: string) => {
    if (!arg.startsWith('--')) {
      throw new InvalidInputError()
    }
  },
  [ArgType.FOLDER]: (arg: string) => {
    if (arg !== '.' && arg !== '..' && arg.split('.').filter(Boolean).length > 1) {
      throw new InvalidInputError()
    }
  }
}

const validate = (cb: Options['handler'], argOptions?: Arg[]): Options['handler'] =>
  async (...args: FnArgs) => {
    argOptions?.forEach(({required, type}, i) => {
      const currentArg = args[i]
      if (required && !currentArg) {
        throw new InvalidInputError()
      }
      validators[type](currentArg)
    })
    await cb(...args)
  }

export const createCommand = (options: Options) => {
  const opts = {...defaultOptions, ...options}
  const {showCurrentDirAfterExec, args, handler} = opts

  const tryCatchHandler = fnErrWrapper(handler)

  const res = showCurrentDirAfterExec ? logCurrentDirWrapper(tryCatchHandler) : tryCatchHandler

  return validate(res, args)
}

type Config = Record<string, Options>

const config: Config = {
  'up': {
    handler: upHandler,
  },
  'cd': {
    args: [
      {type: ArgType.FOLDER, required: true}
    ],
    handler: cdHandler
  },
  'ls': {
    handler: lsHandler,
  },
  'cat': {
    args: [
      {type: ArgType.FILE, required: true}
    ],
    handler: catHandler
  },
  'add': {
    args: [
      {type: ArgType.FILE, required: true}
    ],
    handler: addHandler
  },
  'rm': {
    args: [
      {type: ArgType.FILE, required: true}
    ],
    handler: rmHandler
  },
  'rn': {
    args: [
      {type: ArgType.FILE, required: true},
      {type: ArgType.FILE, required: true}
    ],
    handler: rnHandler
  },
  'cp': {
    args: [
      {type: ArgType.FILE, required: true},
      {type: ArgType.FOLDER, required: true}
    ],
    handler: cpHandler
  },
  'mv': {
    args: [
      {type: ArgType.FILE, required: true},
      {type: ArgType.FOLDER, required: true}
    ],
    handler: mvHandler
  },
  'os': {
    args: [
      {type: ArgType.OPTION, required: true}
    ],
    handler: osHandler
  },
  'hash': {
    args: [{required: true, type: ArgType.FILE}],
    handler: hashHandle
  },
  'compress': {
    args: [
      {type: ArgType.FILE, required: true},
      {type: ArgType.FOLDER, required: true}
    ],
    handler: compressHandler
  },
  'decompress': {
    args: [
      {type: ArgType.FILE, required: true},
      {type: ArgType.FOLDER, required: true}
    ],
    handler: decompressHandler
  },
  '.exit': {
    handler: () => {
      process.exit(0)
    }
  }
}

const createCommands = (config: Config) => {
  const commands: Record<string, cbWithFnArgs> = {}

  Object.entries(config).forEach(([commandName, options]) => {
    commands[commandName] = createCommand(options)
  })

  return commands
}

export const fileManagerCommands = createCommands(config)
