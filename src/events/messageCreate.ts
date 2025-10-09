import { createEvent } from "@types"
import { getDefactoChannel } from "@utils"
import { ChannelType } from "discord.js"

export default createEvent({
  name: "messageCreate",
  once: false,
  async execute(msg) {
    if (
      msg.channel.type !== ChannelType.DM ||
      msg.author.id !== "244134758286753799"
    )
      return

    const channel = await getDefactoChannel(msg.client)

    channel.send(msg.content)
  },
})
