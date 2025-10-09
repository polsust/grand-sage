import cron from "node-cron"
import { UselessFact } from "@types"
import { ExtendedClient } from "index"
import { EmbedBuilder, SendableChannels } from "discord.js"
import { getDefactoChannel, getRandomColor } from "@utils"

export default async (client: ExtendedClient) => {
  const channel = await getDefactoChannel(client)

  cron.schedule("0 0 22 * * *", async () => {
    const fact = await getFact()
    sendFactMessage(fact, channel)
  })
}

const getFact = async (): Promise<UselessFact> => {
  const response = await fetch(
    "https://uselessfacts.jsph.pl/api/v2/facts/today",
  )

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return (await response.json()) as UselessFact
}

const sendFactMessage = async (
  fact: UselessFact,
  channel: SendableChannels,
) => {
  const embed = new EmbedBuilder()
    .setTitle("Fact of the day")
    .setDescription(fact.text)
    .setColor(getRandomColor())

  channel.send({ embeds: [embed] })
}
