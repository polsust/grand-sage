import { getTtsOption } from "@discord"
import { TtsModule } from "@modules"
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { audioPlayingHandler } from "discord/audioPlayingHandler"

export default {
  slashCommand: new SlashCommandBuilder()
    .setName("tts")
    .setDescription("Speak using voice")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Text to speech")
        .setRequired(true),
    )
    .addStringOption((o) => getTtsOption(o)),
  async execute(interaction: ChatInputCommandInteraction) {
    const input = interaction.options.get("input") as { value: string }
    const ttsPerson = (interaction.options.get("tts_person") as {
      value: string
    }) || { value: "ai" }

    const audioReadable = await TtsModule.generateSpeech(
      input.value,
      ttsPerson.value,
    )

    audioPlayingHandler(interaction, audioReadable)

    interaction.reply(input.value)
  },
}
