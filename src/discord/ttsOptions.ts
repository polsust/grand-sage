import { SlashCommandStringOption } from "discord.js"
import fs from "fs"
import path from "path"

export const getTtsOption = (
  option: SlashCommandStringOption,
): SlashCommandStringOption => {
  const humans = fs.readdirSync(path.join(process.cwd(), "/assets/audio/tts/"))

  return option
    .setName("person")
    .setDescription("Read out loud")
    .setChoices([
      {
        value: "ai",
        name: "AI",
      },
      ...humans.map((human) => ({ name: human.toUpperCase(), value: human })),
    ])
}
