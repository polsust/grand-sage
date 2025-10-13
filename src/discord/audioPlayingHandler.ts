import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice"
import { ChatInputCommandInteraction, GuildMember } from "discord.js"
import { Readable } from "stream"

export const audioPlayingHandler = (
  interaction: ChatInputCommandInteraction,
  audioReadable: Readable,
) => {
  if (!(interaction.member! instanceof GuildMember)) return

  const voiceChannel = interaction.member.voice.channel

  if (!voiceChannel) return

  const audioPlayer = createAudioPlayer()

  const voiceConnection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guildId,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  })
  voiceConnection.subscribe(audioPlayer)

  audioPlayer.play(createAudioResource(audioReadable))
}
