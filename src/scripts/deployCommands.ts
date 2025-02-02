import { REST, Routes } from "discord.js";
import "dotenv/config";
import { getCommands } from "@utils";

const { BOT_TOKEN, BOT_APPLICATION_ID, DEV_SERVER_ID } = process.env;

type DeployModeT = "dev" | "global";

if (!BOT_TOKEN || !BOT_APPLICATION_ID || !DEV_SERVER_ID)
  throw new Error("One or more env variables are missing!");

const commands = getCommands().map((command) => command.data.toJSON());

const args = process.argv.slice(2);

const deployMode: DeployModeT = args[0] === "global" ? "global" : "dev";

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(BOT_TOKEN);

(async () => {
  // and deploy your commands!
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(
      deployMode === "dev"
        ? Routes.applicationGuildCommands(BOT_APPLICATION_ID, DEV_SERVER_ID)
        : Routes.applicationCommands(BOT_APPLICATION_ID),
      { body: commands },
    )) as string;
    console.log(data);

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
