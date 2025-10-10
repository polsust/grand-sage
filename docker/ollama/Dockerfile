FROM ollama/ollama:0.12.4


# Start the Ollama server temporarily, pull the model, then stop it
RUN /bin/bash -c "\
  ollama serve & \
  sleep 5 && \
  ollama pull qwen:0.5b && \
  pkill ollama \
  "

EXPOSE 11434

CMD ["serve"]
