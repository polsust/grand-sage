type JokeBase = {
  error: boolean
  category: string
  flags: {
    nsfw: boolean
    religious: boolean
    political: boolean
    racist: boolean
    sexist: boolean
    explicit: boolean
  }
  id: number
  safe: boolean
  lang: string
}

export type JokeApiResponse =
  | (JokeBase & { type: "single"; joke: string })
  | (JokeBase & { type: "twopart"; setup: string; delivery: string })
