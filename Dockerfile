# syntax=docker/dockerfile:1

# ---- 1. Install dependencies (cached until package*.json changes) ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- 2. Build ---------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the browser bundle at build time, so
# they must be supplied here, not at `docker run`:
#   docker build --build-arg NEXT_PUBLIC_BOOKING_URL=https://cal.com/you .
ARG NEXT_PUBLIC_BOOKING_URL
ENV NEXT_PUBLIC_BOOKING_URL=$NEXT_PUBLIC_BOOKING_URL
ENV NEXT_TELEMETRY_DISABLED=1

# content/ (the Obsidian vault) is read during this build to generate the
# Projects / Research / Writings pages, so it must be in the build context.
RUN npm run build

# ---- 3. Runtime image -------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs
EXPOSE 3000

# Runtime secrets (DATABASE_URL, LOG_LEVEL) are passed with `docker run -e`
# or --env-file — never baked into the image.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
