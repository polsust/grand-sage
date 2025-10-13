import { Client, Collection, GatewayIntentBits, Partials } from "discord.js"

import { getCommands, getEvents, setupCustomFunctions } from "@utils"
import { CommandT } from "@types"

console.log("🚀 Starting...")

export class ExtendedClient extends Client {
  public commands = new Collection<string, CommandT>()
}

const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User],
})

client.commands = await getCommands()

const events = await getEvents()

for (const event of events) {
  client[event.once ? "once" : "on"](event.name, event.execute)
}

await client.login(process.env.BOT_TOKEN)

setupCustomFunctions(client)
