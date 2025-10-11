import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"

import { CommandT } from "@types"
import { AiModule, liveMessageHandler } from "@modules"

export default {
  slashCommand: new SlashCommandBuilder()
    .setName("prompt")
    .setDescription("Prompt the AI")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Content to prompt the AI with")
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const input = interaction.options.get("input") as { value: string }

    await interaction.deferReply()

    const response = await AiModule.prompt([
      {
        role: "user",
        content: input.value,
      },
    ])

    liveMessageHandler(response, interaction)
  },
} as CommandT
