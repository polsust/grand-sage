import { Collection } from "discord.js"

export const chancePercent = (percent: number) => {
  return Math.random() < percent / 100
}

export const getRandomValue = <T>(iterable: T[] | Collection<string, T>): T => {
  if (Array.isArray(iterable))
    return iterable[Math.floor(Math.random() * iterable.length)]

  return iterable.at(Math.floor(Math.random() * iterable.size)) as T
}
