import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
} from "@discordjs/voice"
import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js"
import fs from "fs/promises"
import path from "path"

export default {
  slashCommand: new SlashCommandBuilder()
    .setName("tts")
    .setDescription("Speak using voice")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Text to speech")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const input = interaction.options.get("input") as { value: string }

    interaction.reply(input.value)

    const audioFiles = await fs.readdir(
      path.join(process.cwd(), "assets/audio/tts/pol"),
    )

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

    for (const word of input.value.split(" ")) {
      await readWord(word, audioFiles, audioPlayer)
    }
  },
}

const readWord = async (
  word: string,
  audiosFiles: string[],
  audioPlayer: AudioPlayer,
) => {
  let pauseBetweenWordsMs: number = 10
  for (let i = 0; i < word.length; i++) {
    const letter: string = word.charAt(i)
    const nextLetter: string = word.charAt(i + 1)

    if (audioExists(letter + nextLetter, audiosFiles)) {
      await playAudio(letter, nextLetter, "", audioPlayer)
      i++
    } else if (audioExists(letter, audiosFiles)) {
      await playAudio(letter, "", "", audioPlayer)
    } else if (letter === ",") {
      pauseBetweenWordsMs = 500
    } else if (letter === ".") {
      pauseBetweenWordsMs = 700
    }
  }

  return new Promise((resolve) => {
    setTimeout(async () => {
      resolve(true)
    }, pauseBetweenWordsMs)
  })
}

const audioExists = (silab: string, audiosFiles: string[]): boolean => {
  return audiosFiles.includes(silab.toLowerCase() + ".mp3")
}

const playAudio = async (
  letter: string,
  nextLetter: string = "",
  previousLetter: string = "",
  audioPlayer: AudioPlayer,
) => {
  // console.log(previousLetter + letter + nextLetter)

  const audioResource = createAudioResource(
    path.join(
      process.cwd(),
      "assets/audio/tts/pol/",
      `${previousLetter.toLowerCase()}${letter.toLowerCase()}${nextLetter.toLowerCase()}.mp3`,
    ),
  )

  audioPlayer.play(audioResource)
  await entersState(audioPlayer, AudioPlayerStatus.Idle, 30_000)
}
