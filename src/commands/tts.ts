import {
  getTtsPersonOption,
  getTtsPitchOption,
  getTtsSpeedOption,
} from "@discord"
import { TtsModule } from "@modules"
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js"
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
    .addStringOption((o) => getTtsPersonOption(o))
    .addStringOption((o) => getTtsSpeedOption(o))
    .addStringOption((o) => getTtsPitchOption(o)),
  async execute(interaction: ChatInputCommandInteraction) {
    const input = interaction.options.get("input") as { value: string }
    const ttsPerson = interaction.options.get("tts_person") as {
      value: string
      name: string
    } | null
    const speed = interaction.options.get("tts_speed") as
      | { value?: number }
      | undefined
    const pitch = interaction.options.get("tts_pitch") as
      | { value?: number }
      | undefined

    const deferedReply = interaction.deferReply()

    const audioReadable = await TtsModule.generateSpeech(
      input.value,
      (ttsPerson?.value as string) || "pol",
      { speed: speed?.value, pitch: pitch?.value },
    )

    audioPlayingHandler(interaction, audioReadable)

    const embed = new EmbedBuilder()
      .setTitle(`TEXT TO SPEECH as ${ttsPerson?.value || "pol"}`)
      .setDescription(input.value)
      .setColor(Colors.Purple)

    await deferedReply
    interaction.editReply({ embeds: [embed] })
  },
}
