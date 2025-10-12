import cron from "node-cron"
import { Fact, UselessFact } from "@types"
import { ExtendedClient } from "index"
import { EmbedBuilder, SendableChannels } from "discord.js"
import { getDefactoChannel, getRandomColor } from "@utils"
import { chancePercent, getRandomValue } from "utils/chance"
import fs from "node:fs"
import { AiModule } from "@modules"

export default async (client: ExtendedClient) => {
  const channel = await getDefactoChannel(client)

  cron.schedule("0 0 22 * * *", async () => {
    init(channel)
  })
}
const init = async (channel: SendableChannels) => {
  const fact = await getFact()
  const message = await sendFactMessage(fact, channel)

  if (!fact.isReal) {
    const res = await AiModule.prompt(
      [
        {
          role: "user",
          content: `I made you send this incorrect FACT OF THE DAY: ${fact.text}
                    Tell everyone the fact was incorrect.
                    Now you I want you to make up a silly excuse for having sent this fact don't take responsibility but first explain that it was incorrect.
                    Keep the message short (under 80 characters). End it with an emoji.`,
        },
      ],
      false,
      true,
    )

    setTimeout(() => message.reply(res.message.content), 3.6e6 * 3) //3.6e6 1 hour
  }
}

const getFact = async (): Promise<Fact> => {
  if (chancePercent(3)) {
    const file = fs.readFileSync(
      process.cwd() + "/assets/data/fake_facts.json",
      "utf-8",
    )
    const fakeFacts: string[] = JSON.parse(file)

    const fakeFact = getRandomValue(fakeFacts)

    return { text: fakeFact, isReal: false }
  }

  const response = await fetch(
    "https://uselessfacts.jsph.pl/api/v2/facts/today",
  )

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  const uselessFact = (await response.json()) as UselessFact
  return {
    text: uselessFact.text,
    isReal: true,
  }
}

const sendFactMessage = async (fact: Fact, channel: SendableChannels) => {
  const embed = new EmbedBuilder()
    .setTitle("Fact of the day")
    .setDescription(fact.text)
    .setColor(getRandomColor())

  return channel.send({ embeds: [embed] })
}
