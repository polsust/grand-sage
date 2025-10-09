import { Client } from "discord.js"

export const getDefactoChannel = async (client: Client) => {
  const defacto_channel_id = process.env.DEFACTO_CHANNEL_ID

  if (!defacto_channel_id)
    throw new Error("DEFACTO_CHANNEL_ID is missing in ENV")

  const channel = await client.channels.fetch(defacto_channel_id, {
    force: true,
    allowUnknownGuild: true,
  })
  if (!channel || !channel.isSendable()) throw new Error("Channel not found")

  return channel
}
