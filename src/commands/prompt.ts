import {
  CacheType,
  CommandInteractionOption,
  Message,
  SlashCommandBuilder,
} from "discord.js"
import ollama from "ollama"
import dayjs from "dayjs"

import { CommandT } from "@types"

const MAX_MSG_LENGTH = 2000
const MSG_LENGTH_MARGIN = 100

export default {
  slashCommand: new SlashCommandBuilder()
    .setName("prompt")
    .setDescription("Prompt the AI")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Content to prompt the AI with")
        .setRequired(true),
    ),

  async execute(interaction) {
    const input = interaction.options.get(
      "input",
    ) as CommandInteractionOption<CacheType> & { value: string }

    await interaction.deferReply()

    const response = await ollama.chat({
      model: "deepseek-r1:1.5b",
      messages: [
        {
          role: "user",
          content: input.value,
        },
      ],
      stream: true,
    })

    let ongoingMessageContent = ""
    let latestMessage: Message<boolean> | null = null

    let isDoneThinking = false

    for await (const part of response) {
      const { content: aiContent } = part.message

      if (!isDoneThinking) {
        if (aiContent.includes("</think>")) isDoneThinking = true
        continue
      }

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
  },
} as CommandT
