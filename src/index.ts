import { Client, Collection, GatewayIntentBits } from "discord.js";
import "dotenv/config";

import { getCommands, getEvents } from "@utils";

export class ExtendedClient extends Client {
  public commands = new Collection<string, any>();
}

const client = new ExtendedClient({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = getCommands();

const events = getEvents();

for (const event of events) {
  client[event.once ? "once" : "on"](event.name, (...args) =>
    event.execute(...args),
  );
}

client.login(process.env.BOT_TOKEN);
