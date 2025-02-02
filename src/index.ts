import { Client, Collection, GatewayIntentBits } from "discord.js";
import "dotenv/config";

import { getCommands, getEvents } from "@utils";
import { CommandT } from "@types";

export class ExtendedClient extends Client {
  public commands = new Collection<string, CommandT>();
}

const client = new ExtendedClient({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = getCommands();

const events = getEvents();

for (const event of events) {
  client[event.once ? "once" : "on"](event.name, event.execute);
}

client.login(process.env.BOT_TOKEN);
