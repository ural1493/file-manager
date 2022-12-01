import {fnErrWrapper, InvalidInputError, logCurrentDirWrapper} from "./utils.js";
import {osHandler} from "./os.js";
import {addHandler, catHandler, cpHandler, mvHandler, rmHandler, rnHandler} from "./fsCommands.js";
import {cdHandler, upHandler} from "./cd.js";
import {lsHandler} from "./ls.js";
import {hashHandle} from "./hash.js";
import {compressHandler, decompressHandler} from "./zip.js";

export const ArgType = {
  FILE: 'file',
  FOLDER: 'folder',
  OPTION: 'option',
}

const defaultOptions = {
  showCurrentDirAfterExec: true,
  args: undefined,
  handler: (...args) => {
  }
}

export const validators = {
  [ArgType.FILE]: (arg) => {
    if (arg.split('.').filter(Boolean).length < 2) {
      throw new InvalidInputError()
    }
  },
  [ArgType.OPTION]: (arg) => {
    if (!arg.startsWith('--')) {
      throw new InvalidInputError()
    }
  },
  [ArgType.FOLDER]: (arg) => {
    if (arg !== '.' && arg !== '..' && arg.split('.').filter(Boolean).length > 1) {
      throw new InvalidInputError()
    }
  }
}

const validate = (cb, argOptions) =>
  async (...args) => {
    argOptions?.forEach(({required, type}, i) => {
      const currentArg = args[i]
      if (required && !currentArg) {
        throw new InvalidInputError()
      }
      validators[type](currentArg)
    })
    await cb(...args)
  }

export const createCommand = (options) => {
  const opts = {...defaultOptions, ...options}
  const {showCurrentDirAfterExec, args, handler} = opts

  const wrappedHandler = fnErrWrapper(validate(handler, args))

  return showCurrentDirAfterExec ? logCurrentDirWrapper(wrappedHandler) : wrappedHandler
}

const config = {
  'up': {
    handler: upHandler,
    showCurrentDirAfterExec: false,
  },
  'cd': {
    args: [
      {type: ArgType.FOLDER, required: true}
    ],
    showCurrentDirAfterExec: false,
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

const createCommands = (config) => {
  const commands = {}

  Object.entries(config).forEach(([commandName, options]) => {
    commands[commandName] = createCommand(options)
  })

  return commands
}

export const fileManagerCommands = createCommands(config)
