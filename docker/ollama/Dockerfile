FROM ollama/ollama:0.12.5

ARG MODEL=gemma3:1b

# Start server in background
RUN ollama serve & \
  # Wait for server to respond
  until ollama ps >/dev/null 2>&1; do sleep 1; done && \
  # Pull model(s)
  ollama pull $MODEL && \
  pkill ollama

EXPOSE 11434

CMD ["serve"]

