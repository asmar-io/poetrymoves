FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./

# Disable husky hooks in CI environment
RUN npm pkg delete scripts.prepare

# Clean install for production
RUN npm ci


# Rebuild the source code only when needed
FROM deps AS builder
WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG FB_API_KEY
ARG FB_AUTH_DOMAIN
ARG FB_PROJECT_ID
ARG FB_STORAGE_BUCKET
ARG FB_MESSAGING_SENDER_ID
ARG FB_APP_ID
ARG FB_MEASUREMENT_ID
ARG POETRY_CONTRACT
ARG POETRY_DATA_OBJECT

RUN echo ${FB_API_KEY}

ENV NEXT_PUBLIC_FB_API_KEY=$FB_API_KEY
ENV NEXT_PUBLIC_FB_AUTH_DOMAIN=$FB_AUTH_DOMAIN
ENV NEXT_PUBLIC_FB_PROJECT_ID=$FB_PROJECT_ID
ENV NEXT_PUBLIC_FB_STORAGE_BUCKET=$FB_STORAGE_BUCKET
ENV NEXT_PUBLIC_FB_MESSAGING_SENDER_ID=$FB_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FB_APP_ID=$FB_APP_ID
ENV NEXT_PUBLIC_FB_MEASUREMENT_ID=$FB_MEASUREMENT_ID
ENV NEXT_PUBLIC_POETRY_CONTRACT=$POETRY_CONTRACT
ENV NEXT_PUBLIC_POETRY_DATA_OBJECT=$POETRY_DATA_OBJECT

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

ENV NEXT_PUBLIC_PIM_BACKEND_URL=https://pim-backend-dev-wnuqi465gq-uc.a.run.app
ENV NEXT_PUBLIC_SUI_NETWORK=testnet

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER nextjs

EXPOSE ${PORT}

CMD ["npm", "run", "start"]