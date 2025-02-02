import fs from "node:fs";
import path from "node:path";

export const getEvents = () => {
  const events = new Set();

  const eventsPath = path.join(process.cwd(), "src/events");

  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);

    const event = require(filePath).default;

    events.add(event);
  }

  return events;
};
