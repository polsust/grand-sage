import { CommandInteraction, SlashCommandBuilder } from "discord.js"

export type CommandT = {
  slashCommand: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => void | Promise<void>
}
