import { Colors } from "discord.js"
import { getRandomValue } from "./chance"

export const getRandomColor = (): (typeof Colors)[keyof typeof Colors] => {
  const keys = Object.keys(Colors) as Array<keyof typeof Colors>
  const randomKey = getRandomValue(keys)

  return Colors[randomKey]
}
