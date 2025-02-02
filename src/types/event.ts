import { ClientEvents } from "discord.js";

export type EventT<Name extends keyof ClientEvents = keyof ClientEvents> = {
  name: Name;
  once: boolean;
  execute: (...args: ClientEvents[Name]) => void | Promise<void>;
};

export const createEvent = <Name extends keyof ClientEvents>(
  event: EventT<Name>,
): EventT<Name> => event;
