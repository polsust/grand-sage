import { CommandT } from "@types";
import {
  CacheType,
  CommandInteractionOption,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import ollama from "ollama";

const MAX_MESSAGE_LENGTH = 1950;

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
    ) as CommandInteractionOption<CacheType> & { value: string };

    await interaction.deferReply();

    const response = await ollama.chat({
      model: "deepseek-r1:1.5b",
      messages: [
        {
          role: "user",
          content: input.value,
        },
      ],
      stream: true,
    });

    let currentMessage = "";
    let latestMessage: Message<boolean> | null = null;

    for await (const part of response) {
      const { content: aiContent } = part.message;

      if ("\n" != aiContent || aiContent.trim() != "") {
        if (currentMessage.length > MAX_MESSAGE_LENGTH && latestMessage) {
          latestMessage = await latestMessage.reply(aiContent);

          currentMessage = "";
        } else {
          const newContent = `${currentMessage}${aiContent}`;

          if (latestMessage) {
            latestMessage = await latestMessage.edit(newContent);
          } else {
            latestMessage = await interaction.editReply(newContent);
          }
        }
      }

      currentMessage += aiContent;
    }
  },
} as CommandT;
