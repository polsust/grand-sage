import { Client, Collection, GatewayIntentBits, Partials } from "discord.js"
import "dotenv/config"

import { getCommands, getEvents } from "@utils"
import { CommandT } from "@types"
import { setupCustom } from "utils/setupCustom"

console.log("🚀 Starting...")

export class ExtendedClient extends Client {
  public commands = new Collection<string, CommandT>()
}

const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
})

client.commands = getCommands()

const events = getEvents()

for (const event of events) {
  client[event.once ? "once" : "on"](event.name, event.execute)
}

client.login(process.env.BOT_TOKEN)

setupCustom(client)
