import { AiTextModule } from "@modules"
import { createEvent } from "@types"
import { chancePercent, getDefactoChannel } from "@utils"
import { ChannelType, Message, OmitPartialGroupDMChannel } from "discord.js"

export default createEvent({
  name: "messageCreate",
  once: false,
  async execute(msg) {
    handlePrivateMsgs(msg)

    if (chancePercent(0.1)) {
      const res = AiTextModule.prompt(
        [
          {
            role: "user",
            content: `${msg.author} just sent this on discord: ${msg.content}. Make a reply mocking them with personal attacks. Keep the message very short`,
          },
        ],
        false,
        true,
      )

      msg.reply((await res).message.content)
    }
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
