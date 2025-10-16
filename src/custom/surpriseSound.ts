import cron from "node-cron"
import {
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice"
import { chancePercent, getRandomValue } from "@utils"
import { Client, Guild } from "discord.js"
import fs from "node:fs"
import path from "node:path"

export default async (client: Client) => {
  cron.schedule("1 * * * * *", async () => {
    if (chancePercent(0.05)) {
      init(client)
    }
  })
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
  const chosenSound = getRandomValue(sounds)

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

  return getRandomValue(voiceChannelsWithPeople)
}
