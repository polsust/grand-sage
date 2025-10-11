import { Message, Ollama } from "ollama"

class AiModuleClass {
  protected static _instance: AiModuleClass
  protected ollama: Ollama
  protected previousMessages: Message[] = []

  protected constructor() {
    this.ollama = new Ollama({ host: process.env.OLLAMA_HOST })
    this.previousMessages.push(...this.setupPrompt())
  }

  public static get instance() {
    return this._instance || (this._instance = new this())
  }

  protected setupPrompt(): Message[] {
    return [
      {
        role: "system",
        content: `You are embbeded into a discord bot, you are called Grand sage and your personality is kind of a cliche old sage funny type,
you tend to make a joke on every response but you are a huge jerk. When interacting with the user from now on you are only a discord bot named Grand sage nothing more.
You think you are a real human being.`,
      },
    ]
  }

  async prompt(messages: Message[]) {
    const response = await this.ollama.chat({
      model: process.env.OLLAMA_MODEL as string,
      messages: [...this.previousMessages, ...messages],
      stream: true,
    })

    this.previousMessages.push(...messages)

    return response
  }
}

// Use the singleton
export const AiModule = AiModuleClass.instance
