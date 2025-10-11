import { createEvent } from "@types"

export default createEvent({
  name: "clientReady",
  once: true,
  execute(client) {
    console.log(`🤖 Ready! Logged in as ${client.user.tag}`)
  },
})
