import { AiSpeechModule } from "modules/ai"
import { HumanSpeechModule } from "modules/humanSpeech"

// type TtsOptions = HumanSpeechConfig | AiSpeechConfig

export class TtsModule {
  static async generateSpeech(text: string, agent: string) {
    let audio = null

    const engine = agent.startsWith("ai") ? "ai" : "human"

    switch (engine) {
      case "human":
        audio = HumanSpeechModule.generateSpeech(text, { human: agent })
        break
      case "ai":
        audio = AiSpeechModule.generateSpeech(text)
        break
    }

    return audio
  }
}
