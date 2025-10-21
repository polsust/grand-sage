import { getVoiceConnection } from "@discordjs/voice"
import { createEvent } from "@types"

export default createEvent({
  name: "voiceStateUpdate",
  once: false,
  async execute(oldVoiceState, newVoiceState) {
    
    if (oldVoiceState.channel?.guildId && !newVoiceState.channel?.members.size) {
      getVoiceConnection(oldVoiceState.channel?.guildId)?.destroy()
    }
  },
})
