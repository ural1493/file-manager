import * as path from "path";
import {currentFolderPath} from "./index";
import {ArgType, createCommand} from "./command";
import * as fs from "fs";
import * as os from "os";

const catHandler = async (filePath: string) => {
  const resultPath = path.resolve(currentFolderPath, filePath)
  await fs.promises.access(resultPath) // TODO
  const rs = fs.createReadStream(resultPath)
  rs.pipe(process.stdout)
  rs.on('close', () => {
    process.stdout.write(os.EOL)
  })
}

export const cat = createCommand({
  args: [
    {type: ArgType.FILE, required: true}
  ],
  handler: catHandler
})
