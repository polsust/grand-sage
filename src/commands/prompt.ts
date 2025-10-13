import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js"

import { CommandT } from "@types"
import { AiTextModule, TtsModule } from "@modules"
import { audioPlayingHandler, getTtsOption } from "@discord"

export default {
  slashCommand: new SlashCommandBuilder()
    .setName("prompt")
    .setDescription("Prompt the AI")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Content to prompt the AI with")
        .setRequired(true),
    )
    .addStringOption(getTtsOption),

  async execute(interaction: ChatInputCommandInteraction) {
    const input = interaction.options.get("input") as { value: string }
    const ttsPerson = interaction.options.get("tts_person") as {
      value: string
    }

    await interaction.deferReply()

    const response = await AiTextModule.prompt(
      [
        {
          role: "user",
          content: input.value,
        },
      ],
      false,
    )

    const shouldReadOutLoud =
      ttsPerson?.value &&
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channel

    if (shouldReadOutLoud) {
      const audio = await TtsModule.generateSpeech(
        response.message.content,
        ttsPerson.value,
        { voice: "am_santa" },
      )

      audioPlayingHandler(interaction, audio)
    }

    return interaction.editReply(response.message.content)
  },
} as CommandT
