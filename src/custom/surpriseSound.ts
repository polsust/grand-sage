import {
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice"
import { Client, Guild } from "discord.js"
import fs from "node:fs"
import path from "node:path"
import { chancePercent } from "utils/chance"

export default async (client: Client) => {
  setInterval(() => {
    if (chancePercent(3)) {
      init(client)
    }
  }, 3.6e6) // every hour
}

const init = async (client: Client) => {
  const audioPlayer = createAudioPlayer()

  for (const [guildId, guild] of client.guilds.cache) {
    const voiceChannelToJoin = await getVoiceChannelToJoin(guild)
    if (!voiceChannelToJoin) continue

    const sound = getRandomSound()

    const connection = joinVoiceChannel({
      channelId: voiceChannelToJoin.id,
      guildId: guildId,
      adapterCreator: guild.voiceAdapterCreator,
    })

    connection.subscribe(audioPlayer)

    audioPlayer.play(sound)

    audioPlayer.on("stateChange", (_, newState) => {
      if (newState.status == AudioPlayerStatus.Idle) connection.disconnect()
    })
  }
}

const getRandomSound = (): AudioResource => {
  const soundsPath = path.join(process.cwd(), "assets/audio/surpriseSounds")

  const sounds = fs.readdirSync(soundsPath)
  const chosenSound = sounds[Math.floor(Math.random() * sounds.length)]

  const fullPath = path.join(
    process.cwd(),
    "assets/audio/surpriseSounds",
    chosenSound,
  )
  return createAudioResource(fullPath)
}
const getVoiceChannelToJoin = async (guild: Guild) => {
  await guild.channels.fetch()
  await guild.members.fetch()

  const voiceChannelsWithPeople = guild.channels.cache.filter(
    (channel) => channel && channel.isVoiceBased() && channel.members.size > 0,
  )

  if (voiceChannelsWithPeople.size == 0) return

  return voiceChannelsWithPeople.at(
    Math.floor(Math.random() * voiceChannelsWithPeople.size),
  )
}
