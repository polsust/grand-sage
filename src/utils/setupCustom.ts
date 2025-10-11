import fs from "node:fs"
import path from "node:path"
import { CustomFunctionT } from "@types"
import { Client } from "discord.js"

const commandsDirPath = path.join(process.cwd(), "src/custom")

export const setupCustomFunctions = async (client: Client) => {
  const files = fs
    .readdirSync(commandsDirPath)
    .filter((file) => file.endsWith(".ts"))

  for (const file of files) {
    const filePath = path.join(commandsDirPath, file)
    const module = await import(filePath)
    const main = module.default as CustomFunctionT

    main(client)
  }
}
