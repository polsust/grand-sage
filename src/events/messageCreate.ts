import { createEvent } from "@types"
import { getDefactoChannel } from "@utils"
import { ChannelType, Message, OmitPartialGroupDMChannel } from "discord.js"

export default createEvent({
  name: "messageCreate",
  once: false,
  async execute(msg) {
    handlePrivateMsgs(msg)
  },
})

const handlePrivateMsgs = async (
  msg: OmitPartialGroupDMChannel<Message<boolean>>,
) => {
  if (
    msg.channel.type == ChannelType.DM &&
    msg.author.id == "244134758286753799"
  ) {
    const channel = await getDefactoChannel(msg.client)

    channel.send(msg.content)
  }
}
