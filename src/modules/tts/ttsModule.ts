import { AiSpeechConfig, AiSpeechModule } from "modules/ai"
import { HumanSpeechConfig, HumanSpeechModule } from "modules/humanSpeech"
import { spawn } from "child_process"
import { Readable } from "stream"

type GeneralOptions = {
  pitch: number
  speed: number
}

type TtsOptions = Partial<HumanSpeechConfig & AiSpeechConfig & GeneralOptions>

export class TtsModule {
  static async generateSpeech(
    text: string,
    agent: string,
    options?: TtsOptions,
  ) {
    const audio = await this.getAudioReadable(text, agent, options)

    if (options?.speed && options.speed != 1) {
      return this.changeSpeed(audio, options.speed)
    }

    if (options?.pitch && options.pitch != 1) {
      return this.changePitch(audio, options.pitch)
    }

    return audio
  }

  protected static async getAudioReadable(
    text: string,
    agent: string,
    options?: TtsOptions,
  ) {
    const engine = agent.startsWith("ai") ? "ai" : "human"
    switch (engine) {
      case "human":
        return await HumanSpeechModule.generateSpeech(text, {
          human: agent,
          ...options,
        })
      case "ai":
        return await AiSpeechModule.generateSpeech(text, options)
    }
  }

  protected static changeSpeed(audio: Readable, speed: number = 1): Readable {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      "pipe:0",
      "-af",
      `atempo=${speed}`,
      "-f",
      "mp3",
      "pipe:1",
    ])
    audio.pipe(ffmpeg.stdin)

    return ffmpeg.stdout
  }

  static changePitch(audio: Readable, pitch: number = 1) {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      "pipe:0",
      "-af",
      `asetrate=44100*${pitch},aresample=44100,atempo=1/0.9`,
      "-f",
      "mp3",
      "pipe:1",
    ])
    audio.pipe(ffmpeg.stdin)

    return ffmpeg.stdout
  }
}
