# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app

# Non-root user for security
RUN addgroup -S tgx && adduser -S tgx -G tgx

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create log & upload dirs and set permissions
RUN mkdir -p logs src/uploads && chown -R tgx:tgx /app

USER tgx

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
