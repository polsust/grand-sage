import dayjs from "dayjs"
import { ChatInputCommandInteraction, Message } from "discord.js"
import { ChatResponse } from "ollama"

const MAX_MSG_LENGTH = 2000
const MSG_LENGTH_MARGIN = 100

export const liveMessageHandler = async (
  aiResponse: AsyncIterable<ChatResponse>,
  interaction: ChatInputCommandInteraction,
) => {
  let ongoingMessageContent = ""
  let latestMessage: Message<boolean> | null = null

  // let isDoneThinking = false

  for await (const part of aiResponse) {
    const { content: aiContent } = part.message

    // if (!isDoneThinking) {
    //   if (aiContent.includes("</think>")) isDoneThinking = true
    //   continue
    // }

    ongoingMessageContent += aiContent

    if (["\n", ""].includes(aiContent.trim()) && !part.done) continue

    if (!latestMessage) {
      latestMessage = await interaction.editReply(aiContent)
      continue
    }

    const messageIsAlmostTooLong =
      ongoingMessageContent.length > MAX_MSG_LENGTH - MSG_LENGTH_MARGIN

    if (messageIsAlmostTooLong) {
      ongoingMessageContent = ""
      latestMessage = await latestMessage.reply(aiContent)
    } else if (
      !latestMessage.editedAt ||
      dayjs().diff(latestMessage.editedAt) > 1_000 ||
      part.done
    ) {
      latestMessage = await latestMessage.edit(ongoingMessageContent)
    }
  }
}
