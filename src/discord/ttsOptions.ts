import { SlashCommandStringOption } from "discord.js"
import fs from "fs"
import path from "path"

export const getTtsPersonOption = (
  option: SlashCommandStringOption,
): SlashCommandStringOption => {
  const humans = fs.readdirSync(path.join(process.cwd(), "/assets/audio/tts/"))

  return option
    .setName("tts_person")
    .setDescription("Read out loud")
    .setChoices([
      {
        value: "ai",
        name: "AI",
      },
      ...humans.map((human) => ({ name: human.toUpperCase(), value: human })),
    ])
}

export const getTtsPitchOption = (
  option: SlashCommandStringOption,
): SlashCommandStringOption => {
  return option.setName("tts_speed").setDescription("Speed of playback")
}

export const getTtsSpeedOption = (
  option: SlashCommandStringOption,
): SlashCommandStringOption => {
  return option.setName("tts_pitch").setDescription("The pitch for the audio")
}
