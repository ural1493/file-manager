import * as path from "path";
import {currentFolderPath} from "./index";
import {ArgType, createCommand, FnArgs} from "./command";
import * as fs from "fs";

const cdHandler = async (...args: FnArgs) => {
  const newPath = path.resolve(currentFolderPath, ...args)
  await fs.promises.access(newPath) // TODO file doesnt exist errors
  // @ts-ignore
  currentFolderPath = newPath
}

export const cd = createCommand({
  args: [
    {type: ArgType.FOLDER, required: true}
  ],
  handler: cdHandler
})
export const up = createCommand({handler: () => cdHandler(currentFolderPath, '..')})
