import { Colors } from "discord.js"

export const getRandomColor = (): (typeof Colors)[keyof typeof Colors] => {
  const keys = Object.keys(Colors) as Array<keyof typeof Colors>
  const randomKey = keys[Math.floor(Math.random() * keys.length)]

  return Colors[randomKey]
}
