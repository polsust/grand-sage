import { CommandT } from "@types"
import { SlashCommandBuilder } from "discord.js"

export default {
  slashCommand: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  async execute(interaction) {
    await interaction.reply("Pong! 🏓")
  },
} as CommandT
