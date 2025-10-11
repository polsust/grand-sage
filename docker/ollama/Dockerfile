FROM ollama/ollama:0.12.5

# Start server in background
RUN ollama serve & \
  # Wait for server to respond
  until ollama ps >/dev/null 2>&1; do sleep 1; done && \
  # Pull model(s)
  ollama pull llama3:8b && \
  pkill ollama

EXPOSE 11434

CMD ["serve"]

