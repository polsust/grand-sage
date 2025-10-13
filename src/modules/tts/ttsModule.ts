import { AiSpeechConfig, AiSpeechModule } from "modules/ai"
import { HumanSpeechConfig, HumanSpeechModule } from "modules/humanSpeech"

type TtsConfig = Partial<HumanSpeechConfig & AiSpeechConfig>

export class TtsModule {
  static async generateSpeech(text: string, agent: string, config?: TtsConfig) {
    let audio = null

    const engine = agent.startsWith("ai") ? "ai" : "human"

    switch (engine) {
      case "human":
        audio = HumanSpeechModule.generateSpeech(text, {
          human: agent,
          ...config,
        })
        break
      case "ai":
        audio = AiSpeechModule.generateSpeech(text, config)
        break
    }

    return audio
  }
}
