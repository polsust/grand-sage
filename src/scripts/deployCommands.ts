import { REST, Routes } from "discord.js"
import { getCommands } from "@utils"

const { BOT_TOKEN, BOT_APPLICATION_ID } = process.env

if (!BOT_TOKEN || !BOT_APPLICATION_ID)
  throw new Error("One or more env variables are missing!")

const commands = (await getCommands()).map((command) =>
  command.slashCommand.toJSON(),
)

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(BOT_TOKEN)

;(async () => {
  // and deploy your commands!
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    )

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(
      Routes.applicationCommands(BOT_APPLICATION_ID),
      { body: commands },
    )) as string
    console.log(data)

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    )
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()
