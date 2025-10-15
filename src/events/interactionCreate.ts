import { createEvent } from "@types"
import { Colors, EmbedBuilder } from "discord.js"
import { ExtendedClient } from "index"

export default createEvent({
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return

    const command = (interaction.client as ExtendedClient).commands.get(
      interaction.commandName,
    )

    if (!command) {
      return console.error(
        `No command matching ${interaction.commandName} was found.`,
      )
    }

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          embeds: [getErrorEmbed(error as Error)],
        })
      } else {
        await interaction.reply({
          embeds: [getErrorEmbed(error as Error)],
        })
      }
    }
  },
})

const getErrorEmbed = (error: Error) => {
  return new EmbedBuilder()
    .setTitle("An error has occurred while running this command!")
    .setDescription(error?.message)
    .setColor(Colors.Red)
}
