FROM ollama/ollama:0.30.0

ARG MODEL=gemma4:e2b

# Start server in background
RUN ollama serve & \
  # Wait for server to respond
  until ollama ps >/dev/null 2>&1; do sleep 1; done && \
  # Pull model(s)
  ollama pull $MODEL && \
  pkill ollama

EXPOSE 11434

CMD ["serve"]

