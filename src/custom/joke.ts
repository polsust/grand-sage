import cron from "node-cron"
import { JokeApiResponse } from "@types"
import { chancePercent, getDefactoChannel } from "@utils"
import { Colors, EmbedBuilder } from "discord.js"
import { ExtendedClient } from "index"
import ky from "ky"

export default async (client: ExtendedClient) => {
  cron.schedule("30 * * * * *", async () => {
    if (chancePercent(0.0167)) {
      init(client)
    }
  })
}

const init = async (client: ExtendedClient) => {
  const channel = await getDefactoChannel(client)

  const jokeResponse = await ky
    .get<JokeApiResponse>(
      "https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas",
    )
    .json()

  const embed: EmbedBuilder = new EmbedBuilder().setColor(Colors.Yellow)

  if (jokeResponse.type === "single") {
    embed
      .setTitle(jokeResponse.joke)
      .setDescription("HAHAHAHHAHAHAHAHAHAHAH I'm so funny :joy:")
  } else if (jokeResponse.type === "twopart") {
    const descriptionText =
      jokeResponse.setup.slice(-1) == "?"
        ? "What do you think? 😉"
        : "...Wait for it 😉 ..."

    embed.setTitle(jokeResponse.setup).setDescription(descriptionText)
  }

  const msg = await channel.send({ embeds: [embed] })

  if (jokeResponse.type === "twopart") {
    setTimeout(() => {
      msg.reply(jokeResponse.delivery)
    }, 30000)
  }
}
