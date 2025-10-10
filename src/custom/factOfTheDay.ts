import cron from "node-cron"
import { Fact, UselessFact } from "@types"
import { ExtendedClient } from "index"
import { EmbedBuilder, SendableChannels } from "discord.js"
import { getDefactoChannel, getRandomColor } from "@utils"

export default async (client: ExtendedClient) => {
  const channel = await getDefactoChannel(client)

  cron.schedule("0 0 22 * * *", async () => {
    const fact = await getFact()
    const message = await sendFactMessage(fact, channel)

    if (!fact.isReal) {
      setTimeout(() => message.reply("That was fake 🙂"), 3.6e6) // 1 hour
    }
  })
}

const getFact = async (): Promise<Fact> => {
  // if (chancePercent(10)) {
  //   return { text: "fake fact here", isReal: false }
  // }

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
