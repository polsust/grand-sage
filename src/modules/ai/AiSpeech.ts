import ky from "ky"
import { Readable } from "stream"

export type AiSpeechConfig = {
  voice: string
  lang_code: string
}

export class AiSpeechModule {
  static async generateSpeech(text: string, config?: AiSpeechConfig) {
    // am_adam
    const res = await ky.post(
      `${process.env.AI_VOICE_HOST as string}/v1/audio/speech`,
      {
        json: {
          // eslint-disable-next-line no-control-regex
          input: text.replace(/[^\x00-\x7F]/g, ""), // remove emotes
          voice: config?.voice || "af_alloy",
          lang_code: config?.lang_code || "a",
        },
      },
    )
    const audioBuffer = Buffer.from(await res.arrayBuffer())

    return Readable.from(audioBuffer)
  }
}
