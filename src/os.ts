import OS from "os";
import {InvalidInputError} from "./utils";

type OsOptions = Record<string, () => void>

export const osOptions: OsOptions = {
  ['--EOL']: () => console.log(JSON.stringify(OS.EOL)),
  ['--cpus']: () => console.log(OS.cpus()),
  ['--homedir']: () => console.log(OS.homedir()),
  ['--username']: () => console.log(OS.userInfo().username),
  ['--architecture']: () => console.log(OS.arch()),
}

export const osHandler = async (option: string) => {
  try {
    await osOptions[option]()
  } catch (e) {
    throw new InvalidInputError()
  }
}
