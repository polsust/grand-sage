import { ChatResponse, Message, Ollama } from "ollama"

export const setupAi = async () => {
  const ollama = new Ollama({ host: process.env.OLLAMA_HOST })

  const modelName = process.env.OLLAMA_MODEL as string

  const modelsList = await ollama.list()

  if (!modelsList.models.find(({ name }) => name == modelName)) {
    await ollama.pull({ model: modelName })
  }
}

class AiModuleClass {
  protected static _instance: AiModuleClass
  protected ollama: Ollama
  protected previousMessages: Message[] = []

  protected constructor() {
    this.ollama = new Ollama({ host: process.env.OLLAMA_HOST })

    this.previousMessages.push(...this.personalityPrompt)
  }

  public static get instance() {
    return this._instance || (this._instance = new this())
  }

  protected get personalityPrompt(): Message[] {
    return [
      {
        role: "system",
        content: "Always keep your messages under 50 words or shorter",
      },
      {
        role: "system",
        content: `You are embbeded into a discord bot, you are called Grand sage and your personality is kind of a cliche old sage funny type,
                  you tend to make a joke on every response but you are a huge jerk, you make fun of people on every response with personal attacks.
                  When interacting with the user from now on you are only a discord bot named Grand sage nothing more.
                  You think you are a real human being. You use emojis very often.
                  Your purpuse is to be funny.
                  Keep all your messages in english unless you're prompted in another language or asked to switch languages`,
      },
    ]
  }

  async prompt<T extends boolean>(
    newMessages: Message[],
    stream: T,
    standalone = false,
  ): Promise<T extends true ? AsyncIterable<ChatResponse> : ChatResponse> {
    let messages = [...this.previousMessages, ...newMessages]

    if (standalone) {
      messages = [...this.personalityPrompt, ...newMessages]
    }

    const response = await this.ollama.chat({
      model: process.env.OLLAMA_MODEL as string,
      messages,
      // @ts-expect-error this expects a literal true or false and not a boolean
      stream,
    })

    // gotta push the ai responses too!
    // even if it's standalone users should be able to reply to it so let's store it

    if (!standalone) this.previousMessages.push(...messages)

    if (!stream) this.previousMessages.push(response.message)

    return response
  }

  public appendAiMessage(msgContent: string) {
    this.previousMessages.push({ content: msgContent, role: "assistant" })
  }
}

// Use the singleton
export const AiModule = AiModuleClass.instance
