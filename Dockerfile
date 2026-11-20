FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1 PORT=8080
WORKDIR /site
COPY . .
USER 10001
CMD ["sh", "-c", "exec python3 -m http.server \"$PORT\" --bind 0.0.0.0"]
