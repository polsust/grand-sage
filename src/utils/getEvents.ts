import { EventT } from "@types"
import fs from "node:fs"
import path from "node:path"

export const getEvents = async () => {
  const events = new Set<EventT>()

  const eventsPath = path.join(process.cwd(), "src/events")

  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"))

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)

    const module = await import(filePath)
    const event = module.default

    events.add(event)
  }

  return events
}
