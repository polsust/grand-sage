import fs from "node:fs";
import path from "node:path";

import { Collection } from "discord.js";

const commandsDirPath = path.join(process.cwd(), "src/commands");

export const getCommands = () => {
  const commands = new Collection<string, any>();

  const commandFiles = fs
    .readdirSync(commandsDirPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsDirPath, file);
    const command = require(filePath).default;

    if ("data" in command && "execute" in command) {
      commands.set(command.data.name, command);
    } else {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }

  return commands;
};
