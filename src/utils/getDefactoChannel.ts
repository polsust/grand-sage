import { Client } from "discord.js"

// const CHANNEL_ID = "244135020401393665" // The Sages
const CHANNEL_ID = "587948791169024025" // Bot Testing

export const getDefactoChannel = async (client: Client) => {
  const channel = await client.channels.fetch(CHANNEL_ID, {
    force: true,
    allowUnknownGuild: true,
  })
  if (!channel || !channel.isSendable()) throw new Error("Channel not found")

  return channel
}
